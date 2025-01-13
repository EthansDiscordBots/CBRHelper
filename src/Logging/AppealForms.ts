import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
import { Client as MarcSyncClient, Collection, Entry, EntryData } from "marcsync";
interface Logging extends EntryData {
    userRan: string,
    CommandRan: string,
    RankinGroup: string,
    type: string
}
const ms = new MarcSyncClient(String(process.env.mskey))
const AppealFormsPending: Collection<Logging> = ms.getCollection("MRAppealForms")
const ModAppealForms: Collection<Logging> = ms.getCollection("ModAppealForms")
import { retryOperation } from "../Functions/retry";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        ms.on("entryCreated", async (data) => {
            if (data.getCollectionName() == "MRAppealForms") {
                const embeds = []
                let content = ""
                let charlength = 0
                let embed = new EmbedBuilder()
                for (let i = 0; i < data.getValue("fields").length; i++) {
                    if (charlength < 3000) {
                        content = content + `**${data.getValue("fields")[i].name}**` + "\n\n"
                        content = content + data.getValue("fields")[i].value + "\n\n"
                        charlength += String(data.getValue("fields")[i].name).length
                        charlength += String(data.getValue("fields")[i].name).length
                    } else {
                        embed.setColor(0x00ffe5)
                        embed.setDescription(content)
                        charlength = 0
                        content = ""
                        embeds.push(embed)
                        embed = new EmbedBuilder()
                    }
                    embed.setColor(0x00ffe5)
                    embed.setDescription(content)
                    embeds.push(embed)
                    data.delete()
                }
                client.channels.cache.get("1132230548576817282").send({ content: "<@&1130751888875343982>", embeds: embeds })
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
                    if (charlength < 3000) {
                        content = content + `**${data.getValue("fields")[i].name}**` + "\n\n"
                        content = content + data.getValue("fields")[i].value + "\n\n"
                        charlength += String(data.getValue("fields")[i].name).length
                        charlength += String(data.getValue("fields")[i].name).length
                    } else {
                        charlength = 0
                        content = ""
                        embed.setColor(0x00ffe5)
                        embed.setDescription(content)
                        embeds.push(embed)
                        embed = new EmbedBuilder()
                    }

                }
                embed.setColor(0x00ffe5)
                embed.setDescription(content)
                embeds.push(embed)
                AppealFormsPending.deleteEntryById(data.getValue("_id"))
                client.channels.cache.get("1132230548576817282").send({ content: "<@&1130751888875343982>", embeds: embeds })
            }
        }

        ms.on("entryCreated", async (data) => {
            if (data.getCollectionName() == "ModAppealForms") {
                const embeds = []
                let content = ""
                let embed = new EmbedBuilder()
                for (let i = 0; i < data.getValue("fields").length; i++) {
                    if (content.length < 3000) {
                        content = content + `**${data.getValue("fields")[i].name}**` + "\n\n"
                        content = content + data.getValue("fields")[i].value + "\n\n"
                    } else {
                        embed.setColor(0x00ffe5)
                        embed.setDescription(content)
                        content = ""
                        embeds.push(embed)
                        embed = new EmbedBuilder()
                    }
                    embed.setColor(0x00ffe5)
                    if (content.length >= 1) embed.setDescription(content)
                    embeds.push(embed)
                    data.delete()
                }
                client.channels.cache.get("1328133530424840212").send({ embeds: embeds })
            }
        })
        var pendingappeals
        async function getentries() {
            return await ModAppealForms.getEntries()
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
                    if (charlength < 3000) {
                        content = content + `**${data.getValue("fields")[i].name}**` + "\n\n"
                        content = content + data.getValue("fields")[i].value + "\n\n"
                        charlength += String(data.getValue("fields")[i].name).length
                        charlength += String(data.getValue("fields")[i].name).length
                    } else {
                        charlength = 0
                        content = ""
                        embed.setColor(0x00ffe5)
                        embed.setDescription(content)
                        embeds.push(embed)
                        embed = new EmbedBuilder()
                    }

                }
                embed.setColor(0x00ffe5)
                embed.setDescription(content)
                embeds.push(embed)
                ModAppealForms.deleteEntryById(data.getValue("_id"))
                client.channels.cache.get("1328133530424840212").send({  embeds: embeds })
            }
    }}
}