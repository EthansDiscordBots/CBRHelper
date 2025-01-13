import { PermissionsBitField } from "discord.js"

export function ticketPermission(useropened, interaction, tickettype?) {
    const perms = [
        {
            id: useropened.id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: "1098284216749404351",
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: "1098282647547023430",
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: "1098282737011531806",
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: "1098282927315505262",
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: "1133204480104595476",
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: interaction.channel.guild.roles.everyone.id,
            deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
            allow: [PermissionsBitField.Flags.AttachFiles]
        }
    ]
        return tickettype != "mod" ? perms.filter(a => a.id != "1133204480104595476") : perms
    }