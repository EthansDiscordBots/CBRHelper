import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
module.exports = {
    data: new SlashCommandBuilder()
      .setName("report")
      .setDescription("Report a user to the MODERATION DEPARTMENT.")
      .addUserOption(option => option.setName("user").setDescription("The user you are reporting.").setRequired(true))
      .addStringOption(option => option.setName("reason").setDescription("The reason you are reporting this user.").setRequired(true))
      .addStringOption(option => option.setName("proof").setDescription("The proof of why you are reporting this user, you should use links for this.").setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser("user")
        const reason = interaction.options.getString("reason")
        const proof = interaction.options.getString("proof")
        const embed = new EmbedBuilder()
         .setTitle("❗ New report!")
         .addFields({name: "User", value: `<@${user.id}>`}, {name: "Reason", value: reason}, {name:"Proof", value:proof})
         .setFooter({text:`This report was sent by ${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL()})
         .setColor(0x00ffe5)

         client.channels.cache.get(process.env.ReportCommand).send({embeds:[embed]})
         await interaction.reply({content: "Thank you for this report! The moderation department will deal with this appropriately", ephemeral: true})

    }    
} 