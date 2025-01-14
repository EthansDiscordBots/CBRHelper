import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Events, Embed } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.on(Events.GuildMemberAdd, async member => {
            const joinedGuild = member.guild
            if (joinedGuild.id != process.env.MainServerId) return
            if (member.bot) return
            const embed = new EmbedBuilder()
            .setAuthor({name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true })})
            .setColor(0x00ffe5)
            .setTimestamp()
            .setDescription(`Welcome to Crystal Bay Resorts <@${member.user.id}>! We hope you enjoy it here! Want to apply for a possible HR rank? Visit <#1133077886929219727>!`)
            client.channels.cache.get("1140348271563386940").send({content: `<@${member.user.id}>`, embeds: [embed]})
        })
    }
}