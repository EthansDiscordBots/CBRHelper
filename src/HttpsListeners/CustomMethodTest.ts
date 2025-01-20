import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/custom",
    async execute(req, res, client) {
        res.json({"success": true}).status(200)
    },
    async run(client) {
    }
}
