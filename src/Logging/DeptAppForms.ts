
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
const coll = ms.getCollection("Department Apps")

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        async function appsend(entries) {
            let pendingapps = entries
            const embeds = {
                ["ops"]:{
                    channelId: "1295472059706507428",
                    embeds: []
                },
                ["comms"]:{
                    channelId: "1295471814402768906",
                    embeds: []
                },
                ["hr"]:{
                    channelId: "1295472125809000541",
                    embeds: []
                },
                ["hrquiz"]: {
                    channelId: "1318421062173724733",
                    embeds: []
                },
                ["opsquiz"]: {
                    channelId: "1318420960965169162",
                    embeds: []
                },
                ["commsquiz"]: {
                    channelId: "1318420770929512508",
                    embeds: []
                }
            }
            if (pendingapps?.length > 0) {
                for (let i = 0; i < 10 && i < pendingapps.length; i++) {
                    const data: Entry<Logging> = pendingapps[i]
                    var embed = new EmbedBuilder()
                    embed.setFields(data.getValue("fields"))
                    embed.setColor(0x00ffe5)
                    console.log(data.getValue("AppType"))
                    console.log(data.getValue("fields"))
                    embeds[data.getValue("AppType")].embeds.push(embed)
                    coll.deleteEntryById(data.getValue("_id"))
                }
                for (let i=0; i < Object.keys(embeds).length ; i++) {
                    for (let v = 0; v < embeds[Object.keys(embeds)[i]].embeds.length; i++) {
                        await client.channels.cache.get(embeds[Object.keys(embeds)[i]].channelId).send({embeds: embeds[Object.keys(embeds)[i]].embeds})
                    }
                }
            }

        }

        ms.on("entryCreated", async entry => {
            if (entry.getCollectionName() == "Department Apps") {
                appsend([entry])
            }
        })

        const DepartmentAppLogs: Collection<Logging> = ms.getCollection("Department Apps")
        let entries
        async function getentries() {
            return await DepartmentAppLogs.getEntries()
        }
        retryOperation(getentries)
            .then(res => entries = (res || []))
            .catch(err => entries = [])
        await new Promise(r => setTimeout(r, 2000))
        appsend(entries)
    }
}
