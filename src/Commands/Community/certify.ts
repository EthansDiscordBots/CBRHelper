import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { getCachedRobloxFromDiscord } from "../../Functions/getCachedRobloxFromDiscord"
import { getRoleInGroup } from "../../Functions/getRoleInGroup"
import { Client as Marc } from "marcsync"
const ms = new Marc(String(process.env.mskey))
import { retryOperation } from "../../Functions/retry"
const certicoll = ms.getCollection("certified")
import { QuickDB } from "quick.db"
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("certify")
        .setDescription("Complete the management certification quiz."),
        async execute(interaction, client) {
            const robloxId = await getCachedRobloxFromDiscord(interaction.user.id)
            const roletable = await getRoleInGroup(process.env.groupId, robloxId)
            if (!robloxId) return await interaction.reply({content: "You are not verified on the bot, please run /verify first.", ephemeral: true})
            if (roletable.rank < 30) return await interaction.reply({content: "You do not have sufficient permissions to run this command.", ephemeral: true})
            if (await interaction.member.roles.cache.get(process.env.CertifiedManagementRole)) return await interaction.reply({content: "You are already certified", ephemeral: true})
            await interaction.deferReply({ephemeral: true})
            async function checkMsForCert() {
                return await certicoll.getEntries({discordId: interaction.user.id})
            }
            let foundEntry
            await retryOperation(checkMsForCert).then(response => foundEntry = response)

            if (foundEntry.length > 0) {
                await interaction.member.roles.add(process.env.CertifiedManagementRole)
                return await interaction.followUp({content: "Found quiz completed previously, role re-given."})
            }

            await db.set(`${interaction.user.id}.currentQuestion`, 0)
            await db.set(`${interaction.user.id}.certificationQuestionsCorrect`, 0)

            const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`# **Crystal Bay Resorts Management Certification Exam<:bunnycelebrate:1140636429928628335> **
  
👋 Welcome to the Crystal Bay Resorts Management Certification Quiz! The purpose of this quiz is to teach you the basic procedures at CBR, regarding Shifts and Training Sessions to better prepare you for your role. All the information covered in this quiz can be found in the **[Documents Channel](https://discord.com/channels/480452557949370380/987092780222406676)**. Be sure to review the resources available to ensure your success. Good luck!

_Please type "continue" to begin._`)

            await interaction.member.send({embeds: [embed]})
            await interaction.followUp({content: "Please refer to DMs to continue certification.", ephemeral: true})
    }
}