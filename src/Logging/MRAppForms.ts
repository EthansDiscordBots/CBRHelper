import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
import { Client, Collection, Entry, EntryData } from "marcsync";
interface Logging extends EntryData {
    userRan: string,
    CommandRan: string,
    RankinGroup: string,
    type: string
}
const ms = new Client(String(process.env.mskey))
const AppealFormsPending: Collection<Logging> = ms.getCollection("MRAppsForms")
import { retryOperation } from "../Functions/retry";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            var pendingappeals
            async function getentries() {
                return await AppealFormsPending.getEntries()
            }
            retryOperation(getentries)
                .then(res => pendingappeals = (res || []))
                .catch(err => pendingappeals = [])
            await new Promise(r => setTimeout(r, 3000))
            if (pendingappeals?.length > 0) {
                for (let i = 0; i < 10 && i < pendingappeals.length; i++) {
                    const data: Entry<Logging> = pendingappeals[i]
                    var embed = new EmbedBuilder()
                    embed.setFields(data.getValue("fields"))
                    embed.setColor(0x00ffe5)
                    AppealFormsPending.deleteEntryById(data.getValue("_id"))
                    client.channels.cache.get("1132683214964658197").send({content: "<@&1130866442720526396>", embeds: [embed] })
                }

                
            }
        }, 10000);
    }
}