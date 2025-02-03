import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/transcripts/:id",
    async execute(req, res) {
        res.cookie("redirect_url", `https://cbayr.xyz/transcipts/${req.params.id}`, {
            expires: new Date(Date.now() + 60 * 60 * 1000 * 24),
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
        })
        console.log(req.cookies.userToken)
        console.log(await db.get(`userTokens.${req.cookies.userToken}`))
        if (!req.cookies.userToken) return res.redirect("https://cbayr.xyz/oauth2/main-auth")
        if (!await db.get(`userTokens.${req.cookies.userToken}`)) return res.redirect("https://cbayr.xyz/oauth2/main-auth")
        res.clearCookie("redirect_url")
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}

