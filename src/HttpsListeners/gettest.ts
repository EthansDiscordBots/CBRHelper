import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/test",
    async execute(req, res) {
        res.json({"success": true}).status(200)
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}
