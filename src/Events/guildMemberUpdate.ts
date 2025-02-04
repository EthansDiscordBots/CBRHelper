import { ChannelType, EmbedBuilder, Events, Message } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB();
import { getNextQuestion, checkQuestionAnswer } from "../Functions/getNextCertifyQuestion";
import { Client as MarcSyncClient } from "marcsync";
const ms = new MarcSyncClient(String(process.env.mskey))
const certicoll = ms.getCollection("certified")
import { retryOperation } from "../Functions/retry";
import { getCachedRobloxFromDiscord } from "../Functions/getCachedRobloxFromDiscord";

interface Booster {
    userId: number
}

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(client, oldMember, newMember) {
            const roblox = await db.get(`${newMember.user.id}.verifiedRoblox`) 
            if (!newMember.roles.cache.get(process.env.BoosterRole)) {
                const boostersorig: Array<Booster> = await db.get("serverStorage.boosters") as Array<Booster>
                let boosters = boostersorig.filter(r => r.userId == roblox)
                if (boosters.length > 0) await db.set("serverStorage.boosters", boostersorig.filter(r => r.userId != roblox))

            }
            else if (newMember.roles.cache.get(process.env.BoosterRole)) {
                let boosters: Array<Booster> = await db.get("serverStorage.boosters") as Array<Booster>
                boosters = boosters.filter(r => r.userId == roblox)
                if (boosters.length < 1) await db.push("serverStorage.boosters", {userId: await db.get(`${newMember.user.id}.verifiedRoblox`)})
            }
    }
}