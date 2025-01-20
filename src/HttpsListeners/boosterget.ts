import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder, Events } from "discord.js";

interface Booster {
    UserId: number
}

module.exports = {
    method: 'get',
    directory: "/boosters",
    async execute(req, res, client) {
        const boosters = await db.get("Boosters")
        res.json(boosters).status(200)
    },
    async run(client) {
        client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
            console.log("MemberUpdate")
            if (!newMember.roles.cache.get(process.env.BoosterRole)) {
                console.log("No Booster Role")
                const boostersorig: Array<Booster> = await db.get("Boosters") as Array<Booster>
                let boosters = boostersorig.filter(async r => r.UserId == await db.get(`${newMember.user.id}.verifiedRoblox`))
                if (boosters.length > 0) await db.set("Boosters", boostersorig.filter(async r => r.UserId != await db.get(`${newMember.user.id}.verifiedRoblox`)))
            }
            else if (newMember.roles.cache.get(process.env.BoosterRole)) {
                console.log("Yes Booster Role")
                let boosters: Array<Booster> = await db.get("Boosters") as Array<Booster>
                boosters = boosters.filter(async r => r.UserId == await db.get(`${newMember.user.id}.verifiedRoblox`))
                if (boosters.length < 1) await db.push("Boosters", {UserId: await db.get(`${newMember.user.id}.verifiedRoblox`)})
            }
        })
    }
}
