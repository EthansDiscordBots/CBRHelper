import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";
import * as crypto from "crypto"

module.exports = {
    method: 'get',
    directory: "/oauth2/:stage",
    async execute(req, res) {
        const {stage} = req.params
        if (stage == "start") {
            res.redirect("https://apis.roblox.com/oauth/v1/authorize?client_id=2750000934827931867&redirect_uri=https://cbr.ethansrandomthings.uk/oauth2/discord&scope=openid&response_type=code")
        }
        else if (stage == "discord") {
            const requestfortoken = await fetch("https://apis.roblox.com/v1/token", {
                method: "POST",
                body: new URLSearchParams({
                    code: req.query.code as string,
                    grant_type: "authorization_code",
                    client_id: process.env.RobloxClientId as string,
                    client_secret: process.env.RobloxSecret as string
                })
            })
            const {access_token, token_type} = await requestfortoken.json()

            const userData = await fetch("https://apis.roblox.com/v1/userinfo", {
                method: "GET",
                headers: {
                    Authorization: `${token_type} ${access_token}`
                }
            })

            const {sub} = await userData.json()
            const tempKey = crypto.randomBytes(32).toString("base64")
            res.cookie("UserData", tempKey, {
                expires: new Date(Date.now() + 3600000).toISOString()
            })
            await db.set(`verificationTokens.${tempKey}`, {
                robloxId: sub
            })
            res.json("hiya")
        }
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}
