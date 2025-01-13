import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from "discord.js"
import { QuickDB } from "quick.db"


module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Verify yourself on the discord bot"),
    async execute(interaction: CommandInteraction, client) {

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("Bloxlink")
                    .setLabel("Verify with Bloxlink")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("Emojis")
                    .setLabel("Words in roblox bio")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("Game")
                    .setLabel("Game Verification")
                    .setStyle(ButtonStyle.Success)
            )

        const embed = new EmbedBuilder()
            .setDescription("You are about to begin the verification process to link your roblox account to your discord account, please select your way of verifying from the options below.")
            .setColor(0x00ffe5)

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true })
    }
}