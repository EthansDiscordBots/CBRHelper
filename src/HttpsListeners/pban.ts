import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";
import {getUsernameFromId} from "../Functions/getIdFromUsername"

module.exports = {
    method: 'post',
    directory: "/pban",
    authNeeded: true,
    async execute(req, res) {
        let entries = req.body
        if (Array.isArray(entries)) {
            for (let i = 0; i < entries.length; i++) {
                await db.push("PbanPending", entries[i])
            }
        }
        else {
            await db.push("PbanPending", entries)
        }
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
        setInterval(async () => {
            let PbansPending = await db.get("PbansPending")
            const PbanEmbeds: Array<EmbedBuilder> = []

            await new Promise(r => setTimeout(r, 3000))
            if (PbansPending?.length > 0) {
                const data = PbansPending[0]
                const emmm = new EmbedBuilder()
                emmm.addFields(
                    { name: "User banned:", value: await getUsernameFromId(data.getValue("UserId")) + " // " + String(data.getValue("UserId")), inline: true },
                    { name: "Reason:", value: data.getValue("Reason"), inline: true },
                    { name: "Issued by:", value: (data.getValue("IssuerUserId") == 1 ? "Automated Ban" : await getUsernameFromId(data.getValue("IssuerUserId"))) + " // " + String(data.getValue("IssuerUserId")), inline: true }
                )
                
                let arr = PbansPending.filter(item => item != PbansPending.UserId)
                await db.set("PbansPending", arr)
                emmm.setColor(0x00ffe5)
                PbanEmbeds.push(emmm)
                await fetch("https://cbr.ethansrandomthing.uk/storage/permbans", {
                    method: "POST",
                    headers: {
                        Authroization: process.env.WebsiteAuth as string
                    },
                    body: JSON.stringify({
                        UserId: data.UserId,
                        Reason: data.Reason,
                        IssuerUserId: data.IssuerUserId
                    })
                })

                client.channels.cache.get(process.env.PermBans).send({ embeds: PbanEmbeds }).then(msg => msg.startThread({ name: "Proof" }))
            }
        }, 10000);
    }
}

