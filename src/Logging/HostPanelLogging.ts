import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
import { Client, Collection, Entry, EntryData } from "marcsync";
interface Logging extends EntryData {
    user: string,
    action: string,
    server: number,
    type: string
}
const ms = new Client(String(process.env.mskey))
import { retryOperation } from "../Functions/retry";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        async function traininglogssend(entries) {
            let traininglogspending = entries
            const traininglogsembeds = []
            if (traininglogspending?.length > 0) {
                for (let i = 0; i < 10 && i < traininglogspending.length; i++) {
                    const data: Entry<Logging> = traininglogspending[i]
                    const emmm = new EmbedBuilder()
                    emmm.addFields(
                        { name: "User:", value: data.getValue("user"), inline: true },
                        { name: "Action:", value: data.getValue("action"), inline: true },
                        { name: "Server:", value: String(data.getValue("server")), inline: true }
                    )
                    data.delete()
                    emmm.setColor(0x00ffe5)
                    traininglogsembeds.push(emmm)
                }

                client.channels.cache.get("1209954325036539904").send({ embeds: traininglogsembeds })
            }
        }

        ms.on("entryCreated", async entry => {
            if (entry.getCollectionName() == "Training logs" && entry.getValue("type") == "Hostpanel") {
                traininglogssend([entry])
            }
        })

        const TrainingCentreLogs: Collection<Logging> = ms.getCollection("Training logs")
        let entries
        async function getentries() {
            return await TrainingCentreLogs.getEntries({ type: "Hostpanel" })
        }
        retryOperation(getentries)
            .then(res => entries = (res || []))
            .catch(err => entries = [])
        await new Promise(r => setTimeout(r, 2000))
        traininglogssend(entries)
    }
}