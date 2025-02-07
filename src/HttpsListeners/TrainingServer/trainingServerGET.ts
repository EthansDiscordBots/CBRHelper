import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: "get",
    directory: "/training-servers",
    authNeeded: true,
    async execute(req, res) {
        res.status(200).json(await db.get("TrainingServers"))
    }
}