import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";
import { getRoleInGroup } from "../Functions/getRoleInGroup";
import { getIdFromUsername, getUsernameFromId } from "../Functions/getIdFromUsername";
import { setRank } from "../Functions/setRank";

module.exports = {
    method: 'post',
    directory: "/ranking",
    async execute(req, res) {
        let entries = req.body
        if (Array.isArray(entries)) {
            for (let i = 0; i < entries.length; i++) {
                await db.push("RankingPending", entries[i])
            }
        }
        else {
            await db.push("RankingPending", entries)
        }
        return await res.status(200).json({ message: "Ranking logged" })
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
        setInterval(async () => {
            let pending = await db.get("RankingPending")
            await new Promise(r => setTimeout(r, 3000))
            if (pending?.length > 0) {
                const data = pending[0]
                const {userId, SentAt, rankedBy, newRank, place, placeId} = data
                try {
                    let newRankName, newrankid
                    await fetch(`https://groups.roblox.com/v1/groups/${Number(process.env.groupId)}/roles`).then(async res => {
                        const data = await res.json()
                        data.roles.forEach(function (item) {
                            if (Number.isNaN(Number(newRank))) {
                                if (item.name === newRank) {
                                    newRankName = item.name
                                    newrankid = item.rank
                                }
                            }
                            else if (Number(newRank) <= 255) {
                                if (item.rank === newRank) {
                                    newRankName = item.name
                                    newrankid = item.rank
                                }
                            }
                            else newrankid = Number(newRank)
                            if (item.id === newRank) {
                                newRankName = item.name
                                newrankid = item.rank
                            }
                        });
                    })
                    const role = await getRoleInGroup(Number(process.env.groupId), userId)
                    const currid = role.rank
                    const curr = role.RankName
                    if (currid == newrankid || currid == 0) { // or guest
                        return await db.set("RankingPending", pending.filter(r => r.userId != data.userId))
                    }

                    await setRank(String(process.env.cookie), Number(process.env.groupId), userId, newRank)

                    const emb = new EmbedBuilder()
                        .setTitle(`New User Ranked In ${place}`)
                        .setURL(`https://roblox.com/games/${placeId}`)
                        .addFields(
                            { name: "User Ranked", value: `${(await getUsernameFromId(userId)).name}\n\`${userId}\`` },
                            { name: "Old rank", value: `${curr}` },
                            { name: "New rank", value: `${newRankName}` },
                        )
                    if (rankedBy) emb.addFields({ name: "Ranked by", value: `${rankedBy}\n\`${await getIdFromUsername(rankedBy)}\`` })
                    emb.addFields(
                        { name: "Ranked requested on:", value: `<t:${SentAt}:D> at <t:${SentAt}:T>` },
                    )
                    emb.setColor(0x00ffe5)
                    emb.setTimestamp()
                    await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=352x352&format=png&isCircular=false`).then(
                        async response => {
                            const json = await response.json()
                            await emb.setThumbnail(json.data[0].imageUrl)
                        }
                    )
                    await client.channels.cache.get(process.env.RankLogs).send({ embeds: [emb] })
                    await db.set("RankingPending", pending.filter(r => r.userId != data.userId))
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

