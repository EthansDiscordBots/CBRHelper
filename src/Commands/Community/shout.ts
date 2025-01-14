import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import * as rbx from "noblox.js"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shout")
        .setDescription("Post a message on the group shout")
        .addStringOption(option => option.setName("message").setDescription("Not provided.").setRequired(true)),
        async execute(interaction, client) {
        if (!interaction.member.roles.cache.get(process.env.GroupWallShoutPerms)) return await interaction.reply({content: "You do not have permission to use this command", ephemeral: true})
        await rbx.setCookie(process.env.cookie)
        await rbx.shout(Number(process.env.groupId), interaction.options.getString("message"))
    }
}