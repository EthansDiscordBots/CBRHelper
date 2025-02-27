import { SlashCommandBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { retryOperation } from "../../Functions/retry"
import { getIdFromUsername } from "../../Functions/getIdFromUsername"
import { getUsernameFromId } from "noblox.js"
module.exports = {
    data: new SlashCommandBuilder()
        .setName("in-log")
        .setDescription("Log someones approved inactivity notice"),
    async execute(interaction, client) {
        if (interaction.channel.id != process.env.INLogChannel) return await interaction.reply({ empheral: true, content: "Cannot use this command in this channel." })

        const modal = new ModalBuilder()
            .setCustomId(`InLog`)
            .setTitle("Log inactivity")

        const Username = new TextInputBuilder()
            .setCustomId("Username")
            .setLabel("Username")
            .setPlaceholder("Scr1ptxd_Ethxn")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        const Openreason = new TextInputBuilder()
            .setCustomId("Approver")
            .setPlaceholder("229nicholas229")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setLabel("Approved by")
        const startDate = new TextInputBuilder()
            .setCustomId("StartDate")
            .setPlaceholder("DD-MM-YYYY")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setLabel("Start date")
        const endDate = new TextInputBuilder()
            .setCustomId("EndDate")
            .setPlaceholder("DD-MM-YYYY")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setLabel("End date")

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(Username),
            new ActionRowBuilder<TextInputBuilder>().addComponents(Openreason),       
            new ActionRowBuilder<TextInputBuilder>().addComponents(startDate),
            new ActionRowBuilder<TextInputBuilder>().addComponents(endDate),
        )
        await interaction.showModal(modal)

    }
}