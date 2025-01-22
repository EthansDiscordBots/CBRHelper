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
            res.redirect("https://apis.roblox.com/oauth/v1/authorize?client_id=2750000934827931867&redirect_uri=https://cbayr.xyz/oauth2/discord&scope=openid&response_type=code")
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
                expires: new Date(Date.now() + 60 * 60 * 1000),
                httpOnly: true,
                secure: true, 
                sameSite: 'Strict',
            })
            await db.set(`verificationTokens.${tempKey}`, {
                robloxId: sub
            })
            res.redirect("https://discord.com/oauth2/authorize?client_id=1138830931914932354&response_type=code&redirect_uri=https%3A%2F%2Fcbayr.xyz%2Foauth2%2Fcomplete&scope=identify")
        }
        else if (stage == "complete") {
            const robloxdata = await db.get(`verificationTokens.${req.cookies.UserData}`)
            const encodedCredentials = Buffer.from(`${process.env.OAuth2ClientId}:${process.env.OAuth2Secret}`).toString('base64')
            const requestfortoken = await fetch("https://discord.com/api/v10/oauth2/token", {
                method: "POST",
                body: new URLSearchParams({
                    code: req.query.code as string,
                    grant_type: "authorization_code",
                    redirect_uri: "https://cbayr.xyz/oauth2/complete"
                }),
                headers: {
                    Authorization: `Basic ${encodedCredentials}`
                }
            })
            const requdata = await requestfortoken.json()
            console.log(requdata)
            const {access_token, token_type} = requdata
            console.log(access_token, token_type)
            const userData = await fetch("https://discord.com/api/v10/oauth2/@me", {
                method: "GET",
                headers: {
                    Authorization: `${token_type} ${access_token}`
                } 
            })
            const data = await userData.json()
            console.log(data)
            const user = data.user
            robloxdata.discordId = user.id
            await db.set(`verificationTokens.${req.cookies.UserData}`, robloxdata)

            const userDataFull = await db.get(`verificationToken.${req.cookies.UserData}`)
            await db.set(`${userDataFull.discordId}.verifiedRoblox`, userDataFull.robloxId)
            await db.set(`${userDataFull.robloxId}.discordId`, userDataFull.discordId)
            res.redirect("https://cbayr.xyz/discord")
        }
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}
