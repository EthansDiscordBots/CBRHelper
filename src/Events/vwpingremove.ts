import { Collection, EmbedBuilder } from "discord.js"
import { QuickDB } from "quick.db";
const db = new QuickDB()
import * as cron from "node-cron"

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        cron.schedule("* 0 0 * * *", async () => {
           await db.delete("SHRPingVWs")
        }, {
            timezone: "Canada/Eastern"
        })
        setInterval(async () => {
            interface T {}
            let pingsallowed: Array<T> = await db.get("SHRPingUsers") ?? []
            let pingsnotallowed: Array<T> = await db.get("SHRDontPingUsers") ?? []
            const embed = new EmbedBuilder()
            .setDescription(`Some SHRs want pings, some dont want pings, to prevent confusion on who you can and cant ping w/out punishment, you can see which ones allow pings and those who dont below.`)
            .setColor(0x00ffe5)

            for (let i = 0; i < pingsallowed.length; i++) {
                let member
                member = await client.guilds.cache.get("process.env.MainServerId").members.fetch(pingsallowed[i]).catch(async err => member = await client.guilds.cache.get("process.env.MainServerId").members.fetch("1138830931914932354"))
                if (!member.roles.cache.get("1098284216749404351")) {

                    pingsallowed = pingsallowed.filter(item => item !== pingsallowed[i]);
                
                await db.set("SHRPingUsers", pingsallowed)
            }}

            for (let i = 0; i < pingsnotallowed.length; i++) {
                let member
                member = await client.guilds.cache.get("process.env.MainServerId").members.fetch(pingsnotallowed[i]).catch(async err => member = await client.guilds.cache.get("process.env.MainServerId").members.fetch("1138830931914932354"))
                if (!member.roles.cache.get("1098284216749404351")) {

                pingsnotallowed = pingsnotallowed.filter(item => item !== pingsnotallowed[i]);
                
                await db.set("SHRDontPingUsers", pingsnotallowed)
            }}

            const pallstring = pingsallowed.map(i => `<@${i}>`).join("\n")
            const pnallstring = pingsnotallowed.map(i => `<@${i}>`).join("\n")
            embed.addFields({name: "Pings allowed", value: pallstring || "No users allowed pings", inline: true}, {name: "Pings not allowed", value: pnallstring || "No users disallowed pings", inline: true})
            const msg = await client.channels.cache.get("1244335770500858076").messages.fetch("1244339684331622450")
            msg.edit({embeds: [embed]})
        }, 20000)
    }
};