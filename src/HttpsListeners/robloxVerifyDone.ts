import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/roblox-verify-complete",
    async execute(req, res, client) {
        console.log(req.query)
        const f = await fetch("https://apis.roblox.com/oauth/v1/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: process.env.RobloxClientId as string,
                client_secret: process.env.RobloxSecret as string,
                grant_type: 'authorization_code',
                code: req.query.code
            })
        })
        const data = await f.json()
        const g = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${data.access_token}`
            }
        })
        console.log(await g.json())
    },
    async run(client) {
    }
}
