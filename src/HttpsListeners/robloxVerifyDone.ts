import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/roblox-verify-complete",
    async execute(req, res, client) {
        console.log(req.query)
    },
    async run(client) {
    }
}
