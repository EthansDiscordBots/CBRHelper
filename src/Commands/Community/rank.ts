import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import * as  rbx from "noblox.js"
import { setRank } from "../../Functions/setRank"
import { QuickDB } from "quick.db"
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Rank a user to a new rank on the group")
        .addStringOption(option => option.setName("username").setDescription("None provided.").setRequired(true))
        .addStringOption(option => option.setName("rank").setDescription("Not provided.").setRequired(true).setChoices({ name: "Customer", value: "Customer" }, { name: "Trainee", value: "Trainee" }, { name: "Junior Receptionist", value: "Junior Receptionist" }, { name: "Senior Receptionist", value: "Senior Receptionist" }, { name: "Junior Housekeeper", value: "Junior Housekeeper" }, { name: "Senior Housekeeper", value: "Senior Housekeeper" }, { name: "Junior Security", value: "Junior Security" }, { name: "Senior Security", value: "Senior Security" }, { name: "Head Receptionist", value: "Head Receptionist" }, { name: "Head of Services", value: "Head of Services" }, { name: "Head of Securty", value: "Head of Securty" }, { name: "Management Intern", value: "Management Intern" }, { name: "Supervision Team", value: "Supervision Team" }, { name: "Shift Leader", value: "Shift Leader" }, { name: "Hotel Supervisor", value: "Hotel Supervisor" }, { name: "Assistant Manager", value: "Assistant Manager" }, { name: "General Manager", value: "General Manager" }, { name: "Senior Manager", value: "Senior Manager" }, { name: "Corporate Assistant", value: "Corporate Assistant" }, { name: "Executive Intern", value: "Executive Intern" }))// {name: "Executive Assistant", value:"."}, {name: "Executive Officer", value:"."}, {name: "Senior Executive Officer", value:"."}, {name: "Developer", value:"."}, {name: "Executive Director", value:"."}, {name: "Chief Moderation Officer", value:"."}, {name: "Chief Communications Officer", value:"."}, {name: "Chief Operations Officer", value:"."}, {name: "Chief Human Resources Officer", value:"."}, {name: "Administration Board", value:"."}, {name: "Chief Executive Officer", value:"."}
        .addStringOption(option => option.setName("reason").setDescription("The reason you are ranking this user.").setRequired(true)),
    async execute(interaction, client) {
        const userroblox = await db.get(`${interaction.user.id}.verifiedRoblox`)
        if (!userroblox) return await interaction.reply({content: "You must be verified on the bot to use this command", ephemeral: true})
        var embed
        var embed2
        const username = interaction.options.getString("username")
        const reason = interaction.options.getString("reason")
        const userid = Number(await rbx.getIdFromUsername(username))
        if (!userid) {
            embed = new EmbedBuilder()
                .setDescription("This is not a valid user.")
                .setColor(0x00ffe5)
            return await interaction.reply({ embeds: [embed] })
        }
        const rankbefore = await rbx.getRankNameInGroup(Number(process.env.groupId), userid)
        if (rankbefore === "Guest") {
            embed = new EmbedBuilder()
                .setDescription("This player is not in the group")
                .setColor(0x00ffe5)
            return await interaction.reply({ embeds: [embed] })
        }
        if (rankbefore == interaction.options.getString("rank")) return await interaction.reply({ content: "You can not change someones rank to the rank they are", epehemeral: true })

        if (await rbx.getRankInGroup(Number(process.env.groupId), userroblox) >= 145 && (await rbx.getRole(Number(process.env.groupId), interaction.options.getString("rank"))).rank <= 135) {
            await setRank(String(process.env.cookie), Number(process.env.groupId), userid, interaction.options.getString("rank"))
        }

        else if (await rbx.getRankInGroup(Number(process.env.groupId), userroblox) >= 30 && (await rbx.getRole(Number(process.env.groupId), interaction.options.getString("rank"))).rank <= 17) {
            await setRank(String(process.env.cookie), Number(process.env.groupId), userid, interaction.options.getString("rank"))
        }

        else {
            embed = new EmbedBuilder()
                .setDescription(`You do not have permission to use this command`)
                .setColor(0x00ffe5)
            return await interaction.reply({ embeds: [embed] })
        }
        
        embed = new EmbedBuilder()
            .setDescription(`The user ${interaction.options.getString("username")} has been successfully ranked from **${rankbefore}** to **${interaction.options.getString("rank")}**\n\nReason: ${reason}`)
            .setColor(0x00ffe5)
        embed2 = new EmbedBuilder()
            .addFields(
                { name: "Ranked By:", value: `${interaction.user.tag} // <@${interaction.user.id}>` }, 
                { name: "User being ranked:", value: `${username}\n${userid}` }, 
                { name: "Previous rank:", value: rankbefore }, 
                { name: "New rank:", value: interaction.options.getString("rank") },
                { name: "Command reason:", value: reason }
            )
           
            .setColor(0x00ffe5)

        await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userid}&size=352x352&format=png&isCircular=false`).then(
            async response => {
                const json = await response.json()
                await embed2.setThumbnail(json.data[0].imageUrl)
            }
        )

        embed2.setTimestamp()

        client.channels.cache.get(process.env.RankLogs).send({ embeds: [embed2] })
        await interaction.reply({ embeds: [embed] })
    }
}