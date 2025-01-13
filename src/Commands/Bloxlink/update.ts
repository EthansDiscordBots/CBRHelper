import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { updateUser } from "../../Functions/updateuser"
import { QuickDB } from "quick.db"
import { getUsernameFromId } from "noblox.js"
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Update someone using the discord bot")
        .addUserOption(o => o.setName("discord-user").setDescription("N/A")),
    async execute(interaction, client) {
        var member
        if (!interaction.options.getMember("discord-user")) member = interaction.member
        else if (interaction.options.getMember("discord-user") != interaction.member && !interaction.member.roles.cache.get("987406739961946162")) return await interaction.reply({ content: "You must have the `Bloxlink Updater` role to update other users.", ephemeral: true })
        else member = interaction.options.getMember("discord-user")
        
        const rblxuserid = await db.get(`${member.user.id}.verifiedRoblox`)
        if (!rblxuserid) return await interaction.reply({ content: "The person you are trying to update is not verified.", ephemeral: true })
        await updateUser(rblxuserid, member, await getUsernameFromId(rblxuserid), interaction)
    }
}