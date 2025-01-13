import { CommandInteraction, Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Collection } from "discord.js";
import * as fs from "fs";
import { deployEvents } from "../Functions/deployEvents";
import { deployCommands } from "../Functions/deployCommands";
import { message } from "noblox.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()

interface Command {
    data: {
        name: string;
    };
    execute: (interaction: CommandInteraction, client: Client) => Promise<void>;
}

const commands = new Collection<keyof Command, Command>();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (interaction.isMessageComponent()) {
            if (interaction.customId != "KeepWarn" && !Number(interaction.customId)) return
            if (interaction.user.id != interaction.message.content.split(" ")[0].replace("<@", "").replace(">", "") && interaction.user.id != "849729544906997850") return
            else if (interaction.customId == "KeepWarn") return await interaction.reply({content: "This users vw has been kept on the logs.", ephemeral: true})
            else {
                const messageToRemove = interaction.customId;
                const data = await db.get("SHRPingVWs")
                var userwhopinged, channelin, messageid
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        data[key] = data[key].filter(item => {
                            for (const item of data[key]) {
                                if (item.message === messageToRemove) {
                                    userwhopinged = key
                                    messageid = messageToRemove
                                    channelin = item.channel
                                }
                            }
                            return item.message !== messageToRemove
                        });
                        console.log(userwhopinged)
                        if (data[key].length === 0) {
                            delete data[key];
                        }
                    }
                }
                (await client.guilds.cache.get("process.env.MainServerId").members.fetch(userwhopinged)).send(`The SHR you have pinged in https://discord.com/channels/process.env.MainServerId/${channelin}/${messageid} has removed the verbal warning from your record. Please do not ping another SHR member with their pings disabled.`)
                interaction.message.edit({content: interaction.message.content, components: [], allowedMentions: {parse: []}})
                await interaction.reply({content: "This users vw has been removed from the logs.", ephemeral: true})
                await db.set("SHRPingVWs", data)
            }
        }
    }
}