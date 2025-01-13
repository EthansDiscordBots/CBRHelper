import { TextInputStyle, ModalBuilder, TextInputBuilder, ChannelType, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, InteractionType, ComponentType, Events, Role, Options } from "discord.js";
const date = new Date()
import { getPlayerThumbnail } from "noblox.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client: Client) {
        if (interaction.isButton() && interaction.customId.split("-")[1] == "Colour") {
            const modal = new ModalBuilder()
                .setCustomId(interaction.customId)
                .setTitle("Colour code")

            const code = new TextInputBuilder()
                .setCustomId("HexColourCode")
                .setLabel("Colour code")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("#00ffe5")

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(code),
            )

            interaction.showModal(modal)
        }

        if (interaction.isModalSubmit() && interaction.customId.split("-")[1] == "Colour") {
            const roleId = interaction.customId.split("-")[0]
            const role = client.guilds.cache.get("process.env.MainServerId")?.roles.cache.get(roleId)
            let colour
            await interaction.deferReply({ephemeral: true})
            try {
                colour = parseInt(`0x${interaction.fields.getTextInputValue("HexColourCode").replace(/#/g, "")}`)
            } catch {
                return await interaction.followUp({content: "Invalid hex code provided."})
            }
            role.setColor(colour)
            interaction.followUp({content: "Role colour set, if failed then please try again later."})
        }

    }
}