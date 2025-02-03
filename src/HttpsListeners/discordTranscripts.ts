import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/transcripts/:id",
    async execute(req, res) {
        if (!req.cookies.UserData) return res.redirect("https://cbayr.xyz/oauth2/transcript-auth")
        if (!await db.get(`userTokens.${req.cookies.UserData}`)) return res.redirect("https://cbayr.xyz/oauth2/transcript-auth")
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}

