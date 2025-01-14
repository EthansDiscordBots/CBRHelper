import { PermissionsBitField } from "discord.js"

export function ticketPermission(useropened, interaction, tickettype?) {
    const perms = [
        {
            id: useropened.id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: process.env.MAINSHR,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: process.env.EARole,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: process.env.EORole,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: process.env.SEORole,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: process.env.ModRole,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: interaction.channel.guild.roles.everyone.id,
            deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
            allow: [PermissionsBitField.Flags.AttachFiles]
        }
    ]
        return tickettype != "mod" ? perms.filter(a => a.id != process.env.ModRole) : perms
    }