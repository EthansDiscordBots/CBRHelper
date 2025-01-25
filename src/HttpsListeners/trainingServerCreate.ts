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
        if (body.ServerId) {
            await db.set(`TrainingServers.${body.ServerId}`, Object.fromEntries(Object.entries(body).filter(([key]) => key != "ServerId")))
            console.log(Object.fromEntries(Object.entries(body).filter(([key]) => key != "ServerId")))
            return res.status(200).json("Made training")
        }
        return res.status(400).json("No Body Found")
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
    }
}

module.exports = {
    method: "get",
    directory: "/training-servers",
    async execute(req, res) {
        res.status(200).json(await db.get("TrainingServers"))
    }
}