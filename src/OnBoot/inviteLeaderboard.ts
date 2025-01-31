import * as cron from "node-cron"
import {QuickDB} from "quick.db"
import {EmbedBuilder} from "discord.js"
const db = new QuickDB
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            const embed = new EmbedBuilder()
            .setColor(0x00ffe5)

            const totalInvites = await db.get(`${process.env.MainServerId}.totalInvites`) || {}
            const totalOrder = Object.entries(totalInvites).sort((a, b) => b[1].invites - a[1].invites)
            let totalString = ""
            for (let i = 0; i < 10 && i < totalOrder.length; i++) {
                totalString += `${i}. <@${totalOrder[i]}>: ${totalOrder[i].invites} invites\n`
            }
            (await client.channels.cache.get(process.env.InviteTracking).messages.fetch(process.env.TotalInvites)).edit({
                content: null,
                embeds: [embed.setDescription(totalString.length > 0 ? totalString : "No tracked invites.")]
            })
        }, 20 * 1000)
    }
};