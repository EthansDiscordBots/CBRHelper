import { QuickDB } from "quick.db";
const db = new QuickDB()
export async function getCachedRobloxFromDiscord(DiscordId: String | Number) {
    return await db.get(`${DiscordId}.verifiedRoblox`)
}