import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder, Events } from "discord.js";

interface Booster {
    UserId: number
}

module.exports = {
    method: 'get',
    directory: "/boosters",
    authNeeded: true,
    async execute(req, res, client) {
        const boosters = await db.get("Boosters")
        res.send(boosters).status(200)
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
        client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
            const roblox = await db.get(`${newMember.user.id}.verifiedRoblox`) 
            if (!newMember.roles.cache.get(process.env.BoosterRole)) {
                const boostersorig: Array<Booster> = await db.get("Boosters") as Array<Booster>
                let boosters = boostersorig.filter(r => r.UserId == roblox)
                if (boosters.length > 0) await db.set("Boosters", boostersorig.filter(r => r.UserId != roblox))

            }
            else if (newMember.roles.cache.get(process.env.BoosterRole)) {
                let boosters: Array<Booster> = await db.get("Boosters") as Array<Booster>
                boosters = boosters.filter(r => r.UserId == roblox)
                if (boosters.length < 1) await db.push("Boosters", {UserId: await db.get(`${newMember.user.id}.verifiedRoblox`)})
            }
        })
    }
}
