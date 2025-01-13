import { SlashCommandBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, CommandInteraction, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Client } from "marcsync"
const ms = new Client(String(process.env.mskey))
import { retryOperation } from "../../Functions/retry"
import { getIdFromUsername } from "../../Functions/getIdFromUsername"
import { getUsernameFromId } from "noblox.js"
module.exports = {
    data: new SlashCommandBuilder()
        .setName("otw-role-colour")
        .setDescription("Change your staff of the week role colour"),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const role = interaction.member.roles.cache.filter(r => r.name.toLowerCase().includes("of the week")).map(r => r.id)[0]
        if (!role) return await interaction.followUp({ content: "You must have one of the staff of the week roles to use this command" })
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${role}-Colour`)
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Set hex code")
            )
        const embed = new EmbedBuilder()
            .setDescription("When you click the button below you will be asked for a hex code. You can use [this link](https://g.co/kgs/4tURQrh) to help you.")

        await interaction.followUp({ embeds: [embed], components: [button] })
    }
}