import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'post',
    directory: "/role-panel",
    authNeeded: true,
    async execute(req, res) {
        await db.push("rolepanelpending", req.body)
        res.status(200).json({success: true})
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
        setInterval(async () => {
                    let traininglogspending = await db.get("rolepanelpending")
                    await db.set("rolepanelpending", [])
                    let traininglogsembeds: EmbedBuilder[] = []
                    traininglogspending.sort((a, b) => a.ranat - b.ranat)
                    for (let i = 0; i < traininglogspending.length; i++) {
                        if (i % 10 == 0 && i != 0) {
                            client.channels.cache.get(process.env.HostPanelLogs).send({ embeds: traininglogsembeds })
                            traininglogsembeds = []
                        }
                        const data = traininglogspending[i]
                        const emmm = new EmbedBuilder()
                        emmm.setDescription(`**${data.victim}** has been given the role **${data.role}** by **${data.roler}**`)
                        emmm.setColor(0x00ffe5)
                        traininglogsembeds.push(emmm)
                    }
        
                    if (traininglogsembeds.length > 0) client.channels.cache.get(process.env.HostPanelLogs).send({ embeds: traininglogsembeds })                    
                }, 10000)
    }
}
