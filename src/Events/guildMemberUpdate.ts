import { ChannelType, EmbedBuilder, Events, Message } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB();
import { getNextQuestion, checkQuestionAnswer } from "../Functions/getNextCertifyQuestion";
import { Client as MarcSyncClient } from "marcsync";
const ms = new MarcSyncClient(String(process.env.mskey))
const certicoll = ms.getCollection("certified")
import { retryOperation } from "../Functions/retry";
import { getCachedRobloxFromDiscord } from "../Functions/getCachedRobloxFromDiscord";

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(client, oldMember, newMember) {
            const roblox = await db.get(`${newMember.user.id}.verifiedRoblox`) 
            if (!newMember.roles.cache.get(process.env.BoosterRole)) {
                const boostersorig = await db.get("serverStorage.boosters") as Array<string>
                let boosters = boostersorig.filter(r => r == roblox)
                if (boosters.length > 0) await db.set("serverStorage.boosters", boostersorig.filter(r => r != roblox))

            }
            else if (newMember.roles.cache.get(process.env.BoosterRole)) {
                let boosters = await db.get("serverStorage.boosters") as Array<string>
                boosters = boosters.filter(r => r == roblox)
                if (boosters.length < 1) await db.push("serverStorage.boosters", await db.get(`${newMember.user.id}.verifiedRoblox`))
            }
    }
}