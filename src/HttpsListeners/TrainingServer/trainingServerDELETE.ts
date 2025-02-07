import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: "delete",
    directory: "/training-servers",
    authNeeded: true,
    async execute(req, res) {
        if (!await db.get(`TrainingServers.${req.body.serverId}`)) return res.status(404).json("Server not found")
        await db.delete(`TrainingServers.${req.body.serverId}`)
        res.status(200).json({message: "server deleted"})
    }
}