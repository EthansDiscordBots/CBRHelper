import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, userMention } from "discord.js"
import { Client, Collection, Entry, EntryData} from "marcsync";
const ms = new Client(String(process.env.mskey))
import { retryOperation } from "../../Functions/retry";
import { QuickDB } from "quick.db";
import { getIdFromUsername } from "../../Functions/getIdFromUsername";
import { getUsernameFromId } from "noblox.js";
const db = new QuickDB

module.exports = {
    data: new SlashCommandBuilder()
        .setName("minutes-get")
        .setDescription("Gets the time in game a user has spent this week")
        .addUserOption(option => option.setName("discord-user").setDescription("The user you want to get the minutes of"))
        .addStringOption(option => option.setName("roblox-user").setDescription("The user or userid you want to get the minutes of")),
    async execute(interaction, client) {
        var UserEntry
        var robloxId
        var robloxUsername
        if (interaction.options.getUser("discord-user") && interaction.options.getString("roblox-user")) {
            return await interaction.reply({content: "Please only choose one way of finding the user", ephemeral: true})
        }
        else if (interaction.options.getUser("discord-user")) {
            robloxId = await db.get(`${interaction.user.id}.verifiedRoblox`)
        }
        else if (interaction.options.getString("roblox-user")) {
            const poss = interaction.options.getString("roblox-user")
            const possuserid = await getIdFromUsername(poss)
            if (!possuserid) {
                if (!isNaN(Number(poss))) {
                    robloxId = Number(poss)
                }
            }
            else {
                robloxId = possuserid
            }
        }
        else if (!interaction.options.getString("roblox-user") && !interaction.options.getUser("discord-user")) {
            robloxId = await db.get(`${interaction.user.id}.verifiedRoblox`)
        }

        if (!robloxId) return await interaction.reply({content: "The user you provided was either invalid or not verified on the bot, if no user provided, you are not verified on the bot", ephemeral: true})
        function a() {
            return ms.getCollection("WeeklyMinutes").getEntries({UserId: Number(robloxId)})
        }
        retryOperation(a)
        .then(r => UserEntry = r)
        .catch(r => console.error("Operation failed:", r.message))
        await new Promise(r => setTimeout(r, 1000))
        robloxUsername = await getUsernameFromId(robloxId)
        const replyEmbed = new EmbedBuilder()
        if (UserEntry[0]) {
            var seconds = UserEntry[0].getValue("Seconds") ?? 0
            var afkseconds = UserEntry[0].getValue("AfkSeconds") ?? 0
            replyEmbed.setTitle(`${robloxUsername}'s logged minutes this week`)
            replyEmbed.addFields(
                {name: "Active Minutes", value: `${Math.floor(seconds / 60)} (${seconds} seconds)`, inline: true},
                {name: "AFK Minutes", value: `${Math.floor(afkseconds / 60)} (${afkseconds} seconds)`, inline: true},
                {name: "Total Minutes", value: `${Math.floor((seconds + afkseconds) / 60)} (${seconds + afkseconds} seconds)`, inline: true}
            )
        } else {
            replyEmbed.setDescription(`No data found for ${robloxUsername} (${robloxId}) so far this week.`)
        }
        replyEmbed.setColor(0x00ffe5)
        await interaction.reply({embeds: [replyEmbed]})
    }
}