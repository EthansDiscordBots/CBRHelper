import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'post',
    directory: "/training-servers",
    authNeeded: true,
    async execute(req, res) {
        const body = req.body
        console.log(body)
        console.log(body.serverId)
        if (body.serverId) {
            await db.set(`TrainingServers.${body.serverId}`, Object.fromEntries(Object.entries(body).filter(([key]) => key != "serverId")))
            console.log("TrainingMade")
            return res.status(200).json("Made training")
        }
        return res.status(400).json("No Body Found")
    },
}