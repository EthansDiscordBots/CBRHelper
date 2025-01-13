import { EmbedBuilder, Embed, time, embedLength } from "discord.js";
import { Client, Collection, EntryData } from "marcsync";
interface Ranking extends EntryData {
    userId: number,
    SentAt: number,
    rankedBy?: string,
    newRank: number,
    place: number,
    placeId: number
}
const ms = new Client(String(process.env.mskey))
const rankingcol: Collection<Ranking> = ms.getCollection("Ranking")
import { retryOperation } from "../Functions/retry";
import { getPlayerThumbnail, getUsernameFromId } from "noblox.js";
import { setRank } from "../Functions/setRank";
import { getIdFromUsername } from "../Functions/getIdFromUsername";
import { getRoleInGroup } from "../Functions/getRoleInGroup";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            var pending
            async function getentries() {
                return await rankingcol.getEntries()
            }
            retryOperation(getentries)
                .then(res => pending = (res || []))
            await new Promise(r => setTimeout(r, 3000))
            if (pending?.length > 0) {
                const data = pending[0]
                const userid = data.getValue("userId")
                const timestamp = data.getValue("SentAt")
                const ranker = data.getValue("rankedBy")
                const newrank = data.getValue("newRank")
                const rankedin = data.getValue("place")
                const rankedinid = data.getValue("placeId")
                async function del() {
                    await rankingcol.deleteEntries({ userId: userid })
                }
                try {
                    let newRankName, newrankid
                    await fetch(`https://groups.roblox.com/v1/groups/${Number(process.env.groupId)}/roles`).then(async res => {
                        const data = await res.json()
                        data.roles.forEach(function (item) {
                            if (Number.isNaN(Number(newrank))) {
                                if (item.name === newrank) {
                                    newRankName = item.name
                                    newrankid = item.rank
                                }
                            }
                            else if (Number(newrank) <= 255) {
                                if (item.rank === newrank) {
                                    newRankName = item.name
                                    newrankid = item.rank
                                }
                            }
                            else newrankid = Number(newrank)
                            if (item.id === newrank) {
                                newRankName = item.name
                                newrankid = item.rank
                            }
                        });
                    })
                    const role = await getRoleInGroup(Number(process.env.groupId), userid)
                    const currid = role.rank
                    const curr = role.RankName
                    if (currid == newrankid || currid == 0) { // or guest
                        return retryOperation(del)
                    }

                    await setRank(String(process.env.cookie), Number(process.env.groupId), userid, newrank)

                    const emb = new EmbedBuilder()
                        .setTitle(`New User Ranked In ${rankedin}`)
                        .setURL(`https://roblox.com/games/${rankedinid}`)
                        .addFields(
                            { name: "User Ranked", value: `${await getUsernameFromId(userid)}\n\`${userid}\``},
                            { name: "Old rank", value: `${curr}`},
                            { name: "New rank", value: `${newRankName}`},
                        )
                    if (ranker) emb.addFields({ name: "Ranked by", value: `${ranker}\n\`${await getIdFromUsername(ranker)}\``})
                    emb.addFields(
                        { name: "Ranked requested on:", value: `<t:${timestamp}:D> at <t:${timestamp}:T>`},
                    )
                    emb.setColor(0x00ffe5)
                    emb.setTimestamp()
                    await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userid}&size=352x352&format=png&isCircular=false`).then(
                        async response => {
                            const json = await response.json()
                            await emb.setThumbnail(json.data[0].imageUrl)
                        }
                    )
                    await client.channels.cache.get("1141765600142688506").send({ embeds: [emb] })
                    retryOperation(del)
                }
                catch (err) {
                    console.log(`There was an error ranking someone, see the marcsync info below:`)
                    console.log(data)
                    console.log(err)
                }
            }
        }, 4000);
    }
}