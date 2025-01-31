import * as cron from "node-cron"
import {QuickDB} from "quick.db"
import {EmbedBuilder} from "discord.js"
const db = new QuickDB
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            const embed = new EmbedBuilder()
            .setColor(0x00ffe5)
        }, 20 * 1000)
    }
};