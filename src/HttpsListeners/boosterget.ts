import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/boosters",
    async execute(req, res, client) {
        const boosters = await db.get("Boosters")
        res.json(boosters).status(200)
    },
    async run(client) {
    }
}
