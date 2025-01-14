import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
import { Client as MarcSyncClient, Collection, Entry, EntryData } from "marcsync";
interface Logging extends EntryData {
    userRan: string,
    CommandRan: string,
    RankinGroup: string,
    type: string
}
const ms = new MarcSyncClient(String(process.env.mskey))
const AppealFormsPending: Collection<Logging> = ms.getCollection("ModAppealForms")
import { retryOperation } from "../Functions/retry";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        ms.on("entryCreated", async (data) => {
            if (data.getCollectionName() == "ModAppealForms") {
                console.log(data.getValue("fields"))
                const embeds = []
                let content = ""
                let charlength = 0
                let embed = new EmbedBuilder()
                .setColor(0x00ffe5)
                for (let i = 0; i < data.getValue("fields").length; i++) {
                    embed.setDescription(data.getValue("fields")[i])
                    embeds.push(embed)
                    embed = new EmbedBuilder()
                    .setColor(0x00ffe5)
                }
                data.delete()
                client.channels.cache.get(process.env.ModAppealForms).send({ content: "", embeds: embeds })
            }
        })
        var pendingappeals
        async function getentries() {
            return await AppealFormsPending.getEntries()
        }
        retryOperation(getentries)
            .then(res => pendingappeals = (res || []))
            .catch(err => pendingappeals = [])
        await new Promise(r => setTimeout(r, 1000))
        if (pendingappeals?.length > 0) {
            
            for (let i = 0; i < pendingappeals.length; i++) {
                const embeds = []
                let content = ""
                let charlength = 0
                const data: Entry<Logging> = pendingappeals[i]
                var embed = new EmbedBuilder()
                for (let i = 0; i < data.getValue("fields").length; i++) {
                    embed.setDescription(data.getValue("fields")[i])
                    embeds.push(embed)
                    embed = new EmbedBuilder()
                    .setColor(0x00ffe5)
                }
                
                data.delete()
                client.channels.cache.get(process.env.ModAppealForms).send({ content: "", embeds: embeds })
            }
        }
    }
}