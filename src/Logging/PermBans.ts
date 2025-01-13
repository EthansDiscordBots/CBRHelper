import { EmbedBuilder} from "discord.js";
import { Client, Collection, Entry, EntryData } from "marcsync";
interface Logging extends EntryData {
    UserId: number,
    Reason: string,
    IssuerUserId: number
}
const ms = new Client(String(process.env.mskey))
const PermBans: Collection<Logging> = ms.getCollection("PermBansPending")
import { retryOperation } from "../Functions/retry";
import { getUsernameFromId } from "noblox.js";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            var PbansPending
            const PbanEmbeds = []
            async function getentries() {
                return await PermBans.getEntries()
            }
            retryOperation(getentries)
                .then(res => PbansPending = (res || []))

            await new Promise(r => setTimeout(r, 3000))
            if (PbansPending?.length > 0) {
                const data: Entry<Logging> = PbansPending[0]
                const emmm = new EmbedBuilder()
                emmm.addFields(
                    { name: "User banned:", value: await getUsernameFromId(data.getValue("UserId")) + " // " + String(data.getValue("UserId")), inline: true },
                    { name: "Reason:", value: data.getValue("Reason"), inline: true },
                    { name: "Issued by:", value: (data.getValue("IssuerUserId") == 1 ? "Automated Ban" : await getUsernameFromId(data.getValue("IssuerUserId"))) + " // " + String(data.getValue("IssuerUserId")), inline: true }
                )
                PermBans.deleteEntryById(data.getValue("_id"))
                emmm.setColor(0x00ffe5)
                PbanEmbeds.push(emmm)
                const Pban = ms.getCollection("PermBans")
                async function createEntry() {
                    return await Pban.createEntry({UserId: data.getValue("UserId"), Reason: data.getValue("Reason"), IssuedAt: Math.floor(Date.now() / 1000)})
                }
                retryOperation(createEntry)
    
                client.channels.cache.get("1261714722806567024").send({ embeds: PbanEmbeds }).then(msg => msg.startThread({name: "Proof"}))
            }
        }, 10000);
    }
}