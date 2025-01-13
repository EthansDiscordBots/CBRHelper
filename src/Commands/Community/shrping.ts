import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { QuickDB } from "quick.db"
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shrping")
        .setDescription("Toggle if you want to be pinged or not.")
        .addBooleanOption(option => option.setName("pings-allowed").setDescription("Not provided.").setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.member.roles.cache.get("1098284216749404351")) return await interaction.reply({ content: "You do not have permission to use this command", ephemeral: true })
        const allowed = interaction.options.getBoolean('pings-allowed')
        if (!allowed) {
            await interaction.reply({content: "People will now be punished if they ping you.", ephemeral: true})
            var arr = await db.get("SHRPingUsers")
            arr = arr.filter(item => item !== interaction.user.id)
            await db.set("SHRPingUsers", arr)
            var alron = await db.get("SHRDontPingUsers")
            if (alron.indexOf(interaction.user.id) == -1) await db.push("SHRDontPingUsers", interaction.user.id)
        }
        else {
            await interaction.reply({content: "People will no longer be punished when they ping you.", ephemeral: true})
            var arr = await db.get("SHRDontPingUsers")
            arr = arr.filter(item => item !== interaction.user.id)
            await db.set("SHRDontPingUsers", arr)
            var alron = await db.get("SHRPingUsers")
            if (alron.indexOf(interaction.user.id) == -1) await db.push("SHRPingUsers", interaction.user.id)
            
        }
    }
}