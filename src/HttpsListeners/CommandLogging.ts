import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";
interface Logging {
    userRan: string,
    CommandRan: string,
    RankinGroup: string,
    type: string,
    ranat: number
}

module.exports = {
    method: 'post',
    directory: "/command-logging",
    async execute(req, res, client) {
        let entries = req.body
        if (Array.isArray(entries)) {
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].type == "Training") {
                    await db.push("PendingTrainingCommands", entries[i])
                }
                else if (entries[i].type == "MainGame") {
                    await db.push("PendingMainGameCommands", entries[i])
                }
            }
        }
        else {
            if (entries.type == "Training") {
                await db.push("PendingTrainingCommands", entries)
            }
            else if (entries.type == "MainGame") {
                await db.push("PendingMainGameCommands", entries)
            }
        }
        res.json({"data": "Logging"}).status(200)
    },
    async run(client) {
        setInterval(async () => {
            let traininglogspending = await db.get("PendingTrainingCommands")
            let maingamelogspending = await db.get("PendingMainGameCommands")
            let traininglogsembeds: EmbedBuilder[] = []
            let maingameembeds: EmbedBuilder[] = []
            for (let i = 0; i < traininglogspending.length; i++) {
                if (traininglogsembeds.length == 10) {
                    client.channels.cache.get(process.env.TCCommands).send({ embeds: traininglogsembeds })
                    traininglogsembeds = []
                }
                const data: Logging = traininglogspending[i]
                const emmm = new EmbedBuilder()
                emmm.setTitle("A new command has been ran in the training center!")
                emmm.addFields(
                    { name: "Player who ran command:", value: String(data.userRan), inline: true },

                )
                if (String(data.CommandRan).length <= 1024) emmm.addFields({ name: "Command Ran:", value: String(data.CommandRan), inline: true })
                else if (String(data.CommandRan).length <= 4000) emmm.setDescription(String(data.CommandRan))
                else console.log(`[${new Date().toLocaleDateString("en-US", { timeZone: "Europe/London" })}] ${data.CommandRan}`)
                emmm.addFields(
                    { name: "Players rank in group:", value: String(data.RankinGroup), inline: true },
                    { name: "Ran on:", value: `<t:${data.ranat}:D> at <t:${data.ranat}:T>` }
                )
                emmm.setColor(0x00ffe5)
                traininglogsembeds.push(emmm)
            }

            for (let i = 0; i < maingamelogspending.length; i++) {
                if (maingameembeds.length == 10) {
                    client.channels.cache.get(process.env.TCCommands).send({ embeds: maingameembeds })
                    traininglogsembeds = []
                }
                const data: Logging = maingamelogspending[i]
                const emmm = new EmbedBuilder()
                emmm.setTitle("A new command has been ran in the main game!")
                emmm.addFields(
                    { name: "Player who ran command:", value: String(data.userRan), inline: true },

                )
                if (String(data.CommandRan).length <= 1024) emmm.addFields({ name: "Command Ran:", value: String(data.CommandRan), inline: true })
                else if (String(data.CommandRan).length <= 4000) emmm.setDescription(String(data.CommandRan))
                else console.log(`[${new Date().toLocaleDateString("en-US", { timeZone: "Europe/London" })}] ${data.CommandRan}`)
                emmm.addFields(
                    { name: "Players rank in group:", value: String(data.RankinGroup), inline: true },
                    { name: "Ran on:", value: `<t:${data.ranat}:D> at <t:${data.ranat}:T>` }
                )
                emmm.setColor(0x00ffe5)
                maingameembeds.push(emmm)
            }

            if (traininglogsembeds.length > 0) client.channels.cache.get(process.env.TCCommands).send({ embeds: traininglogsembeds })
            if (maingamelogspending.length > 0) client.channels.cache.get(process.env.MainCommands).send({embeds: maingameembeds}) 
            await db.set("PendingTrainingCommands", [])
            await db.set("PendingMainGameCommands", [])
        }, 10000)
    }
}
