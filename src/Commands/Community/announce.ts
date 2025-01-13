import { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } from "discord.js"
import { QuickDB } from "quick.db"
const db = new QuickDB()
module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Announce a session")
        .addStringOption(option => option.setName("type").setDescription("Is this a training or shift?").setRequired(true).setChoices({ name: "Training", value: "Training" }, { name: "Shift", value: "Shift" }))
        .addUserOption(option => option.setName("host").setDescription("Who is the host of this session").setRequired(true))
        .addUserOption(option => option.setName("co-host").setDescription("The session co-host.").setRequired(true)),
    async execute(interaction, client) {
        const eastern = new Date().toLocaleString("en-US", { timeZone: "Canada/Eastern" })
        const easterns = new Date(eastern)
        const hours = easterns.getHours()
        const minutes = easterns.getMinutes()
        let used = await db.get("TrainingLastAnnounced")
        let shiftlastused = await db.get("ShiftLastUsed")
        const host = interaction.options.getUser("host")
        const co = interaction.options.getUser("co-host")
        const type = interaction.options.getString("type")
        const training_times = [8, 10, 12, 14, 16, 18, 20, 22]
        let embed
        if (type === "Training") {
            for (let i = 0; i < training_times.length; i++) {
                if (training_times[i] - 1 == hours && (interaction.member.roles.cache.get("987085792365125722") || interaction.member.roles.cache.get("987085821427466300") || interaction.member.roles.cache.get("1098284216749404351"))) {
                    if (minutes >= 45) {
                        embed = new EmbedBuilder()
                            .setTitle(":clock1: Training Session")
                            .setDescription("A training session will be commencing shortly down at the Training Center. If you're interested in being promoted to your next rank, we highly suggest you attend and participate!")
                            .addFields({ name: "Host", value: `<@${host.id}>`, inline: true }, { name: "Co-host", value: `<@${co.id}>`, inline: true }, { name: "Link", value: "[Training Centre](https://www.roblox.com/games/6781985443)" })
                    }
                }
                else if ((training_times[i] % 24) == hours && (interaction.member.roles.cache.get("987085792365125722") || interaction.member.roles.cache.get("987085821427466300") || interaction.member.roles.cache.get("1098284216749404351"))) {
                    if (minutes <= 15) {
                        embed = new EmbedBuilder()
                            .setTitle(":clock1: Training Session")
                            .setDescription("A training session will be commencing shortly down at the Training Center. If you're interested in being promoted to your next rank, we highly suggest you attend and participate!")
                            .addFields({ name: "Host", value: `<@${host.id}>`, inline: true }, { name: "Co-host", value: `<@${co.id}>`, inline: true }, { name: "Link", value: "[Training Centre](https://www.roblox.com/games/6781985443)" })
                    }
                }
                else if (interaction.member.roles.cache.get("987084400984477697") || interaction.member.roles.cache.get("987084402116919346") || interaction.member.roles.cache.get("1098283313644445776") || interaction.member.roles.cache.get("987084403698192445")) {
                    embed = new EmbedBuilder()
                        .setTitle(":clock1: Training Session")
                        .setDescription("A training session will be commencing shortly down at the Training Center. If you're interested in being promoted to your next rank, we highly suggest you attend and participate!")
                        .addFields({ name: "Host", value: `<@${host.id}>`, inline: true }, { name: "Co-host", value: `<@${co.id}>`, inline: true }, { name: "Link", value: "[Training Centre](https://www.roblox.com/games/6781985443)" })
                }
            }

            if (used > used + 30 * 60) {
                const embed2 = new EmbedBuilder()
                    .setDescription("The announce command has already been used for this session. If you feel this is wrong, please contact <@!849729544906997850>.")
                await interaction.reply({ embeds: [embed2] })
            }
            else if (embed !== undefined && used < used + 30 * 60) {
                const embed2 = new EmbedBuilder()
                    .setDescription(`A session has been announced with <@${host.id}> as the host!`)
                await interaction.reply({ embeds: [embed2] })
                await client.channels.cache.get('1098295356007137401').send({ content: `<@&1140045877893943417>`, embeds: [embed] })
                await db.set("TrainingLastAnnounced", Math.floor(Date.now() / 1000))
            }
            else if (embed === undefined) {
                embed = new EmbedBuilder().setDescription("There is not a training session starting in the next 10 minutes or 10 minutes ago.")
                await interaction.reply({ embeds: [embed] })
            }
        }
        else if (type === "Shift") {
            var embed2
            var sent = false
            for (var i = 0; i < training_times.length; i++) {
                if (training_times[i] - 1 == hours && (interaction.member.roles.cache.get("987085792365125722") || interaction.member.roles.cache.get("987085821427466300"))) {
                    embed = new EmbedBuilder()
                        .setTitle(":loudspeaker: Hotel Shift")
                        .setDescription("A shift is currently being hosted at the hotel! Head on down using the link below to interact with your peers and work hard for a possible promotion.")
                        .addFields({ name: "Host", value: `<@${host.id}>`, inline: true }, { name: "Co-host", value: `<@${co.id}>`, inline: true }, { name: "Link", value: "[Main Game](https://www.roblox.com/games/6781188865/Crystal-Bay-Resorts-V1)" })
                }
                else if ((training_times[i] % 24) != hours && (interaction.member.roles.cache.get("987085792365125722") || interaction.member.roles.cache.get("987085821427466300"))) {
                    embed = new EmbedBuilder()
                        .setTitle(":loudspeaker: Hotel Shift")
                        .setDescription("A shift is currently being hosted at the hotel! Head on down using the link below to interact with your peers and work hard for a possible promotion.")
                        .addFields({ name: "Host", value: `<@${host.id}>`, inline: true }, { name: "Co-host", value: `<@${co.id}>`, inline: true }, { name: "Link", value: "[Main Game](https://www.roblox.com/games/6781188865/Crystal-Bay-Resorts-V1)" })
                }
                else if (interaction.member.roles.cache.get("1098284216749404351")) {
                    embed = new EmbedBuilder()
                        .setTitle(":loudspeaker: Hotel Shift")
                        .setDescription("A shift is currently being hosted at the hotel! Head on down using the link below to interact with your peers and work hard for a possible promotion.")
                        .addFields({ name: "Host", value: `<@${host.id}>`, inline: true }, { name: "Co-host", value: `<@${co.id}>`, inline: true }, { name: "Link", value: "[Main Game](https://www.roblox.com/games/6781188865/Crystal-Bay-Resorts-V1)" })

                }
                else {
                    embed2 = new EmbedBuilder()
                        .setDescription("It is too close to a training start to host a shift. Please try again later.")
                        .setColor(0x00ffe5)
                    return await interaction.reply({ embeds: [embed2] }).catch()
                }

                if ((shiftlastused + (60 * 6 * 10)) > Math.floor(Date.now() / 1000)) {
                    embed2 = new EmbedBuilder()
                        .setDescription("A shift has been hosted too recently, please try again soon to see if you can host another shift!\nIf you feel this is a mistake please speak to someone in the dev team or above.")
                    await db.set("ShiftLastUsed", Math.floor(Date.now() / 1000))
                    return await interaction.reply({ embeds: [embed2] }).catch()
                }
                else {
                    client.channels.cache.get("1098295356007137401").send({ content: "<@&1140045916385063017>", embeds: [embed] })
                    embed2 = new EmbedBuilder()
                        .setDescription(`A shift was successfully announced with <@${host.id}> as the host`)
                    return await interaction.reply({ embeds: [embed2] }).catch()
                }
            }
        }
    }
}