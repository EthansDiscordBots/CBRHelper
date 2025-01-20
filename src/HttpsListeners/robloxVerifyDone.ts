import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/roblox-verify-complete",
    async execute(req, res, client) {
        console.log(req.params)
        res.redirect("https://youtube.com")
    },
    async run(client) {
    }
}
