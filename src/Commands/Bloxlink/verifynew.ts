import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from "discord.js"
import { QuickDB } from "quick.db"
import { updateUser } from "../../Functions/updateuser"
import { getUsernameFromId } from "../../Functions/getIdFromUsername"
const db = new QuickDB()

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
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel("OAuth2 - Easiest.")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://www.cbayr.xyz/oauth2/start?guildId=${interaction.guild?.id}`)
            )
        const userId = await db.get(`${interaction.user.id}.verifiedRoblox`)
        console.log(await getUsernameFromId(userId))
        if (userId) return await updateUser(userId, interaction.member, await getUsernameFromId(userId), interaction)
        const embed = new EmbedBuilder()
            .setDescription("You are about to begin the verification process to link your roblox account to your discord account, please select your way of verifying from the options below.")
            .setColor(0x00ffe5)

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true })
    }
}