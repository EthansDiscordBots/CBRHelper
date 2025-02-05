import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from "discord.js"
import { QuickDB } from "quick.db"
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wipe-invites")
        .setDescription("Toggle if you want to be pinged or not.")
        .addBooleanOption(option => option.setName("pings-allowed").setDescription("Not provided.").setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You do not have permission to use this command", ephemeral: true })
        await db.set(`${process.env.MainServerId}.lastWipeInvites`, {})
    }
}