import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
interface Logging {
    userRan: string,
    CommandRan: string,
    RankinGroup: string,
    type: string,
    ranat: number
}
import { retryOperation } from "../Functions/retry";
let traininglogspending: any[] = []
let maingamelogspending: any[] = []

export async function CommandLogs(entries: Logging) {
    if (Array.isArray(entries)) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].type == "Training") {
                traininglogspending = entries[i]
            }
            else if (entries[i].type == "MainGame") {
                maingamelogspending = entries[i]
            }
        }
    }
    else {
        if (entries.type == "Training") {
            traininglogspending.unshift(entries)
        }
        else if (entries.type == "MainGame") {
            maingamelogspending.unshift(entries)
        }
    }
}


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        while (true) {
            await new Promise(r => setTimeout(r, 10 * 1000))
            let traininglogsembeds = []
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

            client.channels.cache.get(process.env.TCCommands).send({ embeds: traininglogsembeds })
        }
    }
}
