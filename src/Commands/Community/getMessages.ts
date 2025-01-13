import { SlashCommandBuilder, EmbedBuilder} from "discord.js"
import { QuickDB } from "quick.db"
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("messages-get")
        .setDescription("Get a specific user's messages")
        .addUserOption(option=>option.setName("user").setDescription("The user you want to get the messages of").setRequired(true)),
        async execute(interaction, client) {
        const user = interaction.options.getUser("user")
        let msg = 0
        if (await db.get(`${user.id}.messages`)) {
            msg += await db.get(`${user.id}.messages`)
        }
        if (await db.get(`${user.id}.tolog-messages}`)) {
            msg += await db.get(`${user.id}.tolog-messages}`)
        }
        const embed = new EmbedBuilder()
        .setTitle(`${user.displayName}'s weekly message count.`)
        .setDescription(`<@${user.id}> has sent ${msg} messages this week.`)
        .setColor(0x00ffe5)
        await interaction.reply({embeds: [embed]})
    }
}