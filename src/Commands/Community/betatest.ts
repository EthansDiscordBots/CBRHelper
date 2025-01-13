import { SlashCommandBuilder } from "discord.js"
import { QuickDB } from "quick.db"
const db = new QuickDB()
import { Client } from "marcsync"
const ms = new Client(String(process.env.mskey))
const BetaTesters = ms.getCollection("Beta Testers")
import { retryOperation } from "../../Functions/retry"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beta-tester")
        .setDescription("Whitelist a player to be a beta tester.")
        .addUserOption(option => option.setName("user").setDescription("Not provided.").setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.member.roles.cache.get("1098284216749404351")) return await interaction.reply({ content: "You do not have permission to use this command", ephemeral: true })
        await interaction.deferReply({ ephemeral: true })
        async function add() {
            await BetaTesters.createEntry({
                robloxId: await db.get(`${interaction.options.getMember("user").user.id}.verifiedRoblox`),
                discordId: interaction.options.getMember("user").user.id
            })
        }

        async function rem() {
            await BetaTesters.deleteEntries({
                discordId: interaction.option.getMember("user").user.id
            })
        }

        if (await db.get(`${interaction.options.getMember("user").user.id}.betatester`)) {
            retryOperation(rem)
                .then(async res => {
                    await db.set(`${interaction.options.getMember("user").user.id}.betatester`, false)
                    return await interaction.followUp({ content: "User successfully removed from the beta tester database", ephemeral: true })
                })
                .catch(async err => {
                    console.error(err)
                    return await interaction.followUp({ content: "There was an error whitelisting this user to be a beta tester.", ephemeral: true })
                })
        } else {
            retryOperation(add)
                .then(async res => {
                    await db.set(`${interaction.options.getMember("user").user.id}.betatester`, true)
                    return await interaction.followUp({ content: "User successfully added to the beta tester database", ephemeral: true })
                })
                .catch(async err => {
                    console.error(err)
                    return await interaction.followUp({ content: "There was an error whitelisting this user to be a beta tester.", ephemeral: true })
                })
        }
    }
}