import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
import { Client, Collection, Entry, EntryData } from "marcsync";
interface Logging extends EntryData {
    userRan: string,
    CommandRan: string,
    RankinGroup: string,
    type: string
}
const ms = new Client(String(process.env.mskey))
import { retryOperation } from "../Functions/retry";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        async function TrainingLogs(entries) {
            let traininglogspending = entries
            let traininglogsembeds = []
            if (traininglogspending?.length > 0) {
                for (let i = 0; i < traininglogspending.length; i++) {
                    if (traininglogsembeds.length == 10) {
                        client.channels.cache.get(process.env.TCCommands).send({ embeds: traininglogsembeds })
                        traininglogsembeds = []
                    }
                    const data: Entry<Logging> = traininglogspending[i]
                    const emmm = new EmbedBuilder()
                    emmm.setTitle("A new command has been ran in the training center!")
                    emmm.addFields(
                        { name: "Player who ran command:", value: String(data.getValue("userRan")), inline: true },
                        { name: "Command Ran:", value: String(data.getValue("CommandRan")), inline: true },
                        { name: "Players rank in group:", value: String(data.getValue("RankinGroup")), inline: true },
                        { name: "Ran on:", value: `<t:${data.getValue("ranat")}:D> at <t:${data.getValue("ranat")}:T>` }
                    )
                    data.delete()
                    emmm.setColor(0x00ffe5)
                    traininglogsembeds.push(emmm)
                }

                client.channels.cache.get(process.env.TCCommands).send({ embeds: traininglogsembeds })
            }
        }
        async function MainGameLogsFunc(entries) {
            let maingamepending = entries
            let maingamelogsembeds = []
            if (maingamepending?.length > 0) {
                for (let i = 0; i < maingamepending.length; i++) {
                    if (maingamelogsembeds.length == 10) {
                        client.channels.cache.get(process.env.MainCommands).send({ embeds: maingamelogsembeds })
                        maingamelogsembeds = []
                    }
                    const data: Entry<Logging> = maingamepending[i]
                    const emmm = new EmbedBuilder()
                    emmm.setTitle("A new command has been ran in the main game!")
                    emmm.addFields(
                        { name: "Player who ran command:", value: String(data.getValue("userRan")), inline: true },
                        { name: "Command Ran:", value: String(data.getValue("CommandRan")), inline: true },
                        { name: "Players rank in group:", value: String(data.getValue("RankinGroup")), inline: true },
                        { name: "Ran on:", value: `<t:${data.getValue("ranat")}:D> at <t:${data.getValue("ranat")}:T>` }
                    )
                    data.delete()
                    emmm.setColor(0x00ffe5)
                    maingamelogsembeds.push(emmm)
                }
                client.channels.cache.get(process.env.MainCommands).send({ embeds: maingamelogsembeds })
            }
        }
        let entries
        let maingame

        ms.on("entryCreated", async (entry) => {
            if (entry.getCollectionName() == "Training logs" && entry.getValue("type") == "Command") {
                TrainingLogs([entry])
            }
            else if (entry.getCollectionName() == "MainGame logs" && entry.getValue("type") == "Command") {
                MainGameLogsFunc([entry])
            }
        })

        const TrainingCentreLogs: Collection<Logging> = ms.getCollection("Training logs")
        async function getentries() {
            return await TrainingCentreLogs.getEntries({ type: "Command" })
        }
        retryOperation(getentries)
            .then(res => entries = (res || []))
        await new Promise(r => setTimeout(r, 2000))
        TrainingLogs(entries)

        const MainGameLogs: Collection<Logging> = ms.getCollection("MainGame logs")
        async function getentriesmain() {
            return await MainGameLogs.getEntries({ type: "Command" })
        }
        retryOperation(getentriesmain)
            .then(res => maingame = (res || []))
        await new Promise(r => setTimeout(r, 2000))
        MainGameLogsFunc(maingame)
    }
}
