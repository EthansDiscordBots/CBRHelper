import { QuickDB } from "quick.db";
const db = new QuickDB();
import { Embed, EmbedBuilder, User } from "discord.js";
import * as crypto from "crypto"
module.exports = {
    method: 'get',
    directory: "/oauth2/:stage",
    async execute(req, res) {
        const { stage } = req.params
        if (String(stage).includes("complete")) {
            if (req.cookies.redirect_url) {
                res.redirect(req.cookies.redirect_url)
                res.clearCookie("redirect_url")
            }
            else {
                res.status(503)
            }
        }
        if (stage == "main-auth") {
            let tempKey = crypto.randomBytes(32).toString("hex")
            while (await db.get(`tsverificationTokens.${tempKey}`)) tempKey = crypto.randomBytes(32).toString("hex")
            res.cookie("UserData", tempKey, {
                expires: new Date(Date.now() + 60 * 60 * 1000 * 24),
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
            })
            await db.set(`tsverificationTokens.${tempKey}`, {})
            res.redirect("https://discord.com/oauth2/authorize?client_id=1138830931914932354&response_type=code&redirect_uri=https%3A%2F%2Fcbayr.xyz%2Foauth2%2Fmain-auth-complete&scope=identify")

        }
        else if (stage == "main-auth-complete") {
            const encodedCredentials = Buffer.from(`${process.env.OAuth2ClientId}:${process.env.OAuth2Secret}`).toString('base64')
            const requestfortoken = await fetch("https://discord.com/api/v10/oauth2/token", {
                method: "POST",
                body: new URLSearchParams({
                    code: req.query.code as string,
                    grant_type: "authorization_code",
                    redirect_uri: "https://cbayr.xyz/oauth2/main-auth-complete"
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${encodedCredentials}`
                }
            })
            const requdata = await requestfortoken.json()
            const { access_token, token_type } = requdata
            const userData = await fetch("https://discord.com/api/v10/oauth2/@me", {
                method: "GET",
                headers: {
                    Authorization: `${token_type} ${access_token}`
                }
            })
            const data = await userData.json()
            const user = data.user
            await db.set(`userTokens.${req.cookies.UserData}`, { ...user, expires: Date.now() + 60 * 60 * 1000 * 24 })
        }
        else if (stage == "start") {
            let tempKey = crypto.randomBytes(32).toString("hex")
            while (await db.get(`verificationTokens.${tempKey}`)) tempKey = crypto.randomBytes(32).toString("hex")
            res.cookie("UserData", tempKey, {
                expires: new Date(Date.now() + 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
            })
            if (req.query.guildId) await db.set(`verificationTokens.${tempKey}.guildId`, req.query.guildId)
            res.redirect("https://apis.roblox.com/oauth/v1/authorize?client_id=2750000934827931867&redirect_uri=https://cbayr.xyz/oauth2/discord&scope=openid&response_type=code")
        }
        else if (stage == "discord") {
            const code = req.query.code
            const requestfortoken = await fetch("https://apis.roblox.com/oauth/v1/token", {
                method: "POST",
                body: new URLSearchParams({
                    code: code,
                    grant_type: "authorization_code",
                    client_id: process.env.RobloxClientId as string,
                    client_secret: process.env.RobloxSecret as string
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            const tokendata = await requestfortoken.json()
            const { access_token, token_type } = tokendata

            const userData = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
                method: "GET",
                headers: {
                    Authorization: `${token_type} ${access_token}`
                }
            })
            const hiya = await userData.json()
            const UserId = hiya.sub
            await db.set(`verificationTokens.${req.cookies.UserData}.robloxId`, UserId)
            res.redirect("https://discord.com/oauth2/authorize?client_id=1138830931914932354&response_type=code&redirect_uri=https%3A%2F%2Fcbayr.xyz%2Foauth2%2Fcomplete&scope=identify")
        }
        else if (stage == "complete") {
            const encodedCredentials = Buffer.from(`${process.env.OAuth2ClientId}:${process.env.OAuth2Secret}`).toString('base64')
            const requestfortoken = await fetch("https://discord.com/api/v10/oauth2/token", {
                method: "POST",
                body: new URLSearchParams({
                    code: req.query.code as string,
                    grant_type: "authorization_code",
                    redirect_uri: "https://cbayr.xyz/oauth2/complete"
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${encodedCredentials}`
                }
            })
            const requdata = await requestfortoken.json()
            const { access_token, token_type } = requdata
            const userData = await fetch("https://discord.com/api/v10/oauth2/@me", {
                method: "GET",
                headers: {
                    Authorization: `${token_type} ${access_token}`
                }
            })
            const data = await userData.json()
            const user = data.user
            await db.set(`verificationTokens.${req.cookies.UserData}.discordId`, user.id)

            const userDataFull = await db.get(`verificationTokens.${req.cookies.UserData}`)
            await db.set(`${userDataFull.discordId}.verifiedRoblox`, userDataFull.robloxId)
            await db.set(`${userDataFull.robloxId}.discordId`, userDataFull.discordId)
            res.clearCookie("UserData")
            res.json("You can now use the /verify command again.")
            await new Promise(r => setTimeout(r, 3000))
            res.redirect("https://cbayr.xyz/discord")

            await db.push("sendDMSayingVerifiedMessage", { discordId: userDataFull.discordId, guildId: userDataFull.guildId, robloxId: userDataFull.robloxId })
            await db.delete(`verificationToken.${req.cookies.UserData}`)
        }
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
        setInterval(async () => {
            let userData = await db.pop("sendDMSayingVerifiedMessage")
            if (!userData) return
            let userId = userData.discordId
            let guildId = userData.guildId
            let robloxId = userData.robloxId
            let member
            for (const guild of client.guilds.cache.values()) {
                try {
                    member = await guild.members.fetch(userId);
                    if (member) break;
                } catch (err) {
                    console.error(`Could not fetch member in guild ${guild.id}: ${err.message}`);
                }
            }
            if (guildId) await (await client.guilds.fetch(guildId))?.members.fetch(userId)
            const embed = new EmbedBuilder()
                .setTitle("Verified")
                .setDescription(`You have successfully verified your discord account with https://roblox.com/users/${await db.get(`${userId}.verifiedRoblox`)}/profile. You can now run the /update command`)
            if (member) {
                await member.send({ embeds: [embed] })
            }
        }, 20 * 1000)
        setInterval(async () => {
            const data = await db.get("userTokens")
            for (const [key, value] of Object.entries(data)) {
                if (value.expires < Date.now()) {
                    await db.delete(`userTokens.${key}`)
                }
            }
        }, 60 * 60 * 1000)
    }
}
