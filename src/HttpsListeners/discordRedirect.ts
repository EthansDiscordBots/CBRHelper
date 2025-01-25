import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/discord",
    async execute(req, res) {
        res.redirect("https://discord.gg/QbcY6sQ5ZS")
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}
