import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'post',
    directory: "/host-panel",
    authNeeded: true,
    async execute(req, res) {
        
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}
