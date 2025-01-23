import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/test",
    async execute(req, res) {
        res.send("If the helper bot is offline, all actions are still being logged.").status(200)
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}

