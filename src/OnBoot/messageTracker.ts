import { Collection } from "discord.js"
import { QuickDB } from "quick.db";
const db = new QuickDB()
import * as cron from "node-cron"
import { Client } from "marcsync";
import { retryOperation } from "../Functions/retry";
const ms = new Client(process.env.mskey)

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        cron.schedule("5 0 0 * * 1", async () => {
            client.guilds.cache.get(process.env.MainServerId).members.fetch().then(async fetched => {
                const ids = fetched.map(m => m)
                client.channels.cache.get("1143242466204586125").send("# This weeks messages sent").then((msg) => msg.pin())
                client.channels.cache.get("1257373595546550301").send("# This weeks messages sent").then((msg) => msg.pin())
                for (var i = 0; i < ids.length; i++) {
                    const tolog = await db.get(`${ids[i].user.id}.tolog-messages}`)
                    const messages = await db.get(`${ids[i].user.id}.messages`)
                    if (ids[i].roles.cache.get("1133204480104595476")) {
                        client.channels.cache.get("1257373595546550301").send({ content: `<@${ids[i].user.id}> (${String(ids[i].user.tag).replace(/_/g, "\\_").replace(/\*/g, "\\*")}) messages this week: ${(tolog ?? 0) + (messages ?? 0)}`, allowedMentions: {} })
                    }

                    if (tolog) {
                        await new Promise(r => setTimeout(r, 1000))
                        await db.delete(`${ids[i].user.id}.tolog-messages}`)
                        await client.channels.cache.get("1143242466204586125").send({ content: `<@${ids[i].user.id}> (${String(ids[i].user.tag).replace(/_/g, "\\_").replace(/\*/g, "\\*")}) messages this week: ${(tolog ?? 0) + (messages ?? 0)}`, allowedMentions: {} })
                    }
                    else if (messages) {
                        await new Promise(r => setTimeout(r, 1000))
                        await db.delete(`${ids[i].user.id}.messages`)
                    }

                }
            })
            const col = ms.getCollection("WeeklyMinutes")
            async function coldrop() {
                col.drop()
            }
            retryOperation(coldrop)
        }, {
            timezone: "Canada/Eastern"
        })
    }
};