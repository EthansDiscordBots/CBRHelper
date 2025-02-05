import * as cron from "node-cron"
import { QuickDB } from "quick.db"
import { EmbedBuilder } from "discord.js"
const db = new QuickDB
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            const embed = new EmbedBuilder()
                .setColor(0x00ffe5)
                

            const totalInvites = await db.get(`${process.env.MainServerId}.totalInvites`) || {}
            const totalOrder: Array<object> = Object.entries(totalInvites).sort((a, b) => b[1].invites - a[1].invites)
            let totalString = ""
            for (let i = 0; i < 10 && i < totalOrder.length; i++) {
                const userId = totalOrder[i][0];
                const invites = totalOrder[i][1]?.invites;
                totalString += `${i + 1}. <@${userId}>: ${invites} invites\n`;
            }
            (await client.channels.cache.get(process.env.InviteTracking).messages.fetch(process.env.TotalInvites)).edit({
                content: null,
                embeds: [embed.setTitle("Total Invites").setDescription(totalString.length > 0 ? totalString : "No tracked invites.")]
            })

            const wipeInvites = await db.get(`${process.env.MainServerId}.lastWipeInvites`) || {}
            const wipeOrder = Object.entries(wipeInvites).sort((a, b) => b[1].invites - a[1].invites)
            totalString = ""
            for (let i = 0; i < 10 && i < wipeOrder.length; i++) {
                const userId = wipeOrder[i][0];
                const invites = wipeOrder[i][1].invites;
                totalString += `${i + 1}. <@${userId}>: ${invites} invites\n`;
            }
            (await client.channels.cache.get(process.env.InviteTracking).messages.fetch(process.env.WipedInvites)).edit({
                content: null,
                embeds: [embed.setTitle("Invites since last wipe").setDescription(totalString.length > 0 ? totalString : "No tracked invites.")]
            })

            const weeklyInvites = await db.get(`${process.env.MainServerId}.weeklyInvites`) || {}
            const weeklyOrder = Object.entries(weeklyInvites).sort((a, b) => b[1].invites - a[1].invites)
            totalString = ""
            for (let i = 0; i < 10 && i < weeklyOrder.length; i++) {
                const userId = weeklyOrder[i][0];
                const invites = weeklyOrder[i][1].invites;
                totalString += `${i + 1}. <@${userId}>: ${invites} invites\n`;
            }
            (await client.channels.cache.get(process.env.InviteTracking).messages.fetch(process.env.WeeklyInvites)).edit({
                content: null,
                embeds: [embed.setTitle("Weekly Invites").setDescription(totalString.length > 0 ? totalString : "No tracked invites.")]
            })

        }, 20 * 1000)
    }
};