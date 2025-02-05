import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: "patch",
    directory: "/training-servers",
    authNeeded: true,
    async execute(req, res) {
        const body = req.body
        if (!await db.get(`TrainingServers.${body.serverId}`)) return res.status(404).json("Server Not Found")
        let base = `TrainingServers.${body.serverId}`
        for (const [key, value] of Object.entries(body).filter(([key]) => key != "ServerId")) await db.set(`${base}.${key}`, value)
        
        res.status(200).json("server updated")
    }
}