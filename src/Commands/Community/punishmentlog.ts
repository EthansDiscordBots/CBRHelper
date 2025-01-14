import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()
module.exports = {
    data: new SlashCommandBuilder()
        .setName("log-punishment")
        .setDescription("Log a punishment request."),

    async execute(interaction, client) {
        if (interaction.guild.id != process.env.AdminServerId) return await interaction.reply({ content: "You cannot use this command in this guild", ephemeral: true })
        if (interaction.channel.id != process.env.HRDPunishmentLog && interaction.channel.id != process.env.OpsPunishmentLog) return await interaction.reply({ content: "You must use this command in the Operations or HRD Punishment Logs channel.", ephemeral: true })
        if (!await db.get(`${interaction.user.id}.verifiedRoblox`)) return await interaction.reply({ephemeral: true, content: "You must be verified on the bot before using this command."})

        function generateRandomString(length = 20) {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let randomString = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * letters.length);
                randomString += letters[randomIndex];
            }
            return randomString;
        }
        const punishmentId = generateRandomString(10)
        const modal = new ModalBuilder()
            .setCustomId(`Punishment-${punishmentId}`)
            .setTitle("Log punishment")

        const Username = new TextInputBuilder()
            .setCustomId("Member Username")
            .setLabel("User involved?")
            .setPlaceholder("Scr1ptxd_Ethxn")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        const Openreason = new TextInputBuilder()
            .setCustomId("Reason")
            .setPlaceholder("Admin Abuse")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setLabel("Reason for report.")
        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(Username),
            new ActionRowBuilder<TextInputBuilder>().addComponents(Openreason),
        )
        await interaction.showModal(modal)
    }
} 