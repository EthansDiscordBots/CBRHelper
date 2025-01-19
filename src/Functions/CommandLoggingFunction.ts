import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
interface Logging {
    userRan: string,
    CommandRan: string,
    RankinGroup: string,
    type: string,
    ranat: number
}
import { retryOperation } from "./retry";
import { QuickDB } from "quick.db";
const db = new QuickDB()
let traininglogspending: any[] = []
let maingamelogspending: any[] = []

export async function CommandLogs(entries: Logging) {
    if (Array.isArray(entries)) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].type == "Training") {
                await db.unshift("PendingTrainingCommands", entries[i])
            }
            else if (entries[i].type == "MainGame") {
                await db.unshift("PendingMainGameCommands", entries[i])
            }
        }
    }
    else {
        if (entries.type == "Training") {
            await db.unshift("PendingTrainingComands", entries)
        }
        else if (entries.type == "MainGame") {
            await db.unshift("PendingMainGameCommands", entries)
        }
    }
    console.log(traininglogspending)
    console.log(maingamelogspending)
}