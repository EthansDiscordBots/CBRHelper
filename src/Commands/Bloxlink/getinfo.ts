import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import * as rbx from "noblox.js"
import { QuickDB } from "quick.db"
import { getIdFromUsername } from "../../Functions/getIdFromUsername"
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getinfo")
        .setDescription("Gets the roblox info of someone")
        .addStringOption(option => option.setName("roblox-username").setDescription("Roblox username of the person who's roblox data you are checking."))
        .addUserOption(o => o.setName("discord-user").setDescription("Discord user of the person you are trying to look up.")),
    async execute(interaction, client) {
        const robloxusername = interaction.options.getString("roblox-username")
        const discorduser = interaction.options.getMember("discord-user")
        let linkeddiscord
        let linkedroblox
        let linkedrobloxId
        const embed = new EmbedBuilder()
        if (robloxusername && discorduser) return await interaction.reply({content: "Only one option is meant to be used, roblox or discord, not both.", ephemeral: true})
        else if (!robloxusername && !discorduser) linkeddiscord = interaction.member
        else if (discorduser && !robloxusername) linkeddiscord = discorduser
        else if (!discorduser && robloxusername) linkedroblox = robloxusername

        if (linkeddiscord) {
            linkedroblox = await rbx.getUsernameFromId(await db.get(`${linkeddiscord.user.id}.verifiedRoblox`) as number)
            linkedrobloxId = await db.get(`${linkeddiscord.user.id}.verifiedRoblox`)
        } else {
            linkedrobloxId = await getIdFromUsername(linkedroblox)
        }
        if (linkedroblox) linkeddiscord = await db.get(`${linkedrobloxId}.discordId`)


        const robloxData = await fetch(`https://users.roblox.com/v1/users/${linkedrobloxId}`).then(async res => await res.json())
        const thumbnail = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${linkedrobloxId}&size=420x420&format=Png&isCircular=false`).then(async res => await res.json()) 
        embed.setTitle(robloxData.displayName)
        embed.addFields(
        {
            name: "Username",
            value: linkedroblox,
            inline: true
        }, 
        {
            name: "ID",
            value: String(robloxData.id),
            inline: true
        }, 
        {
            name: "Account Created",
            value: `<t:${Math.floor(new Date(robloxData.created).getTime() / 1000)}:F>`,
            inline: true
        })
        if (linkeddiscord) embed.addFields({name: "Discord account", value: `<@${linkeddiscord}>`, inline: true})
        embed.addFields(
        {
            name: "Rank in group",
            value: await fetch(`https://groups.roblox.com/v2/users/${linkedrobloxId}/groups/roles`).then(async res => {
                const data = await res.json()
                let targetGroupEntry = data.data.find((entry) => {return entry.group.id === 4720080});
                if (targetGroupEntry) {
                    return targetGroupEntry.role.name
                }
                else {
                    return "Guest"
                }
        }),
            inline: true
        }
        ,{
            name: "Description",
            value: robloxData.description
        })
        embed.setColor(0x00ffe5)
        embed.setThumbnail(thumbnail.data[0].imageUrl)

        return await interaction.reply({embeds: [embed]})
    }
}