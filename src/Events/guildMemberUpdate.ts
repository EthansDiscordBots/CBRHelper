import { ChannelType, EmbedBuilder, Events, Message } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB();
import { getNextQuestion, checkQuestionAnswer } from "../Functions/getNextCertifyQuestion";
import { Client as MarcSyncClient } from "marcsync";
const ms = new MarcSyncClient(String(process.env.mskey))
const certicoll = ms.getCollection("certified")
import { retryOperation } from "../Functions/retry";
import { getCachedRobloxFromDiscord } from "../Functions/getCachedRobloxFromDiscord";
import { json } from "stream/consumers";

interface Booster {
    userId: number
}


module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember, client) {
            const roblox = await db.get(`${newMember.user.id}.verifiedRoblox`) 
            const currentBoostersRAW = await fetch("https://cbr.ethansrandomthings.uk/storage/boosters", {
            method: "PATCH", 
            body: JSON.stringify({
                userId: roblox
            }), 
            headers: {
                Authorization: process.env.WebsiteAuth as string
            }})
            const boosters = await currentBoostersRAW.json()
            if (!newMember.roles.cache.get(process.env.BoosterRole)) {
                if (boosters.length > 0) {
                    await fetch("https://cbr.ethansrandomthings.uk/storage/boosters", {
                        method: "DELETE",
                        body: JSON.stringify({
                            userId: roblox
                        }),
                        headers: {
                            Authorization: process.env.WebsiteAuth as string
                        }
                    })
                }
            }
            else if (newMember.roles.cache.get(process.env.BoosterRole)) {
                if (boosters.length < 1) {
                    await fetch("https://cbr.ethansrandomthings.uk/storage/boosters", {
                        method: "POST",
                        body: JSON.stringify({
                            userId: roblox
                        }),
                        headers: {
                            Authorization: process.env.WebsiteAuth as string
                        }
                    })
                }
            }
    }
}