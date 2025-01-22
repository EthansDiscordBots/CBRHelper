import { ButtonInteraction, CommandInteraction, EmbedBuilder, Guild, GuildAuditLogsEntry } from "discord.js"
import * as rbx from "noblox.js"

export async function updateUser(userid, member, rblxusername, interaction?: CommandInteraction | ButtonInteraction) {
    const binds = [
        {
            minrole: 4,
            maxrole: 17,
            roles: [process.env.MAINLR]
        },
        {
            minrole: 20,
            maxrole: 125,
            roles: [process.env.MAINMR]
        },
        {
            minrole: 130,
            maxrole: 155,
            roles: [process.env.MAINHR]
        },
        {
            minrole: 157,
            maxrole: 255,
            roles: [process.env.BLUpdater, process.env.MAINSHR]
        },
        {
            minrole: 140,
            maxrole: 255,
            roles: [process.env.RevivePing]
        },
        {
            minrole: 145,
            maxrole: 255,
            roles: [process.env.BLUpdater]
        },
        {
            minrole: 123,
            maxrole: 255,
            roles: [process.env.GroupWallShoutPerms]
        },
    ]
    var rank
    var RankName
    const removed = []
    const add = []
    await fetch(`https://groups.roblox.com/v2/users/${userid}/groups/roles`).then(async res => {
        const data = await res.json()
        let targetGroupEntry = data.data.find((entry) => {return entry.group.id === 4720080});
        if (targetGroupEntry) {
            RankName = targetGroupEntry.role.name
            rank = targetGroupEntry.role.rank
        }
        else {
            RankName = "Customer"
            rank = 1
        }
    })
    const roles = (await fetch("https://groups.roblox.com/v1/groups/4720080/roles").then(async res => {
        const data = await res.json()
        return data.roles
    })).map(r => r.name)
    let displayName = rblxusername

    await member.setNickname(`${displayName}`).catch((err) => console.log("Username not changed as I do not have permission to"));
    let oldrole
    if (!interaction) return
    const guild = interaction.guild as Guild
    const newrole = guild.roles.cache?.find(role => role.name == RankName)
    for (let i = 0; i < roles.length; i++) {
        const roleName = roles[i];
        oldrole = guild.roles.cache?.find(role => role.name == roleName && role.name != RankName);
        if (oldrole && member.roles.cache.get(oldrole.id) && oldrole?.name != newrole?.name) {
            await member.roles.remove(oldrole.id);
            removed.unshift(` ${oldrole.name}`)
        }
    }
    if (newrole && !member.roles.cache.get(newrole.id)) {
        await member.roles.add(newrole.id);
        add.unshift(` ${newrole.name}`)
    }
    if (!member.roles.cache.get((interaction.guild?.roles.cache.find(role => role.name == "Verified"))?.id)) {
        add.unshift(" Verified")
        await member.roles.add((interaction.guild?.roles.cache.find(role => role.name == "Verified"))?.id)
    }

    if (member.roles.cache.get((interaction.guild?.roles.cache.find(role => role.name == "Unverified"))?.id)) {
        removed.unshift(" Unverified")
        await member.roles.remove((interaction.guild?.roles.cache.find(role => role.name == "Unverified"))?.id)
    }

    if (interaction.guild?.id == process.env.MainServerId) {
        for (let i = 0; i < binds.length; i++) {
            const bind = binds[i]
            if (rank < bind.minrole || rank > bind.maxrole) {
                for (let i = 0; i < bind.roles.length; i++) {
                    if (member.roles.cache.get(bind.roles[i])) {
                        await member.roles.remove(bind.roles[i])
                        removed.unshift(" " + interaction.guild.roles.cache.get(bind.roles[i]).name)
                    }
    
                }
            }
        }
    
        for (let i = 0; i < binds.length; i++) {
            const bind = binds[i]
            if (rank >= bind.minrole && rank <= bind.maxrole) {
                for (let i = 0; i < bind.roles.length; i++) {
                    if (!member.roles.cache.get(bind.roles[i])) {
                        await member.roles.add(bind.roles[i])
                        add.unshift(" " + interaction.guild.roles.cache.get(bind.roles[i]).name)
                    }
    
                }
            }
        }
    }
    if (add.length >= 1 || removed.length >= 1) {
        const embed = new EmbedBuilder()
            .setColor("Red")
        if (add.length > 0) embed.addFields({ name: "Added roles", value: add.toString(), inline: true })
        if (removed.length > 0) embed.addFields({ name: "Removed Roles", value: removed.toString(), inline: true })
        if (interaction.isCommand() && interaction.commandName == "verify-all") 
            return
        if (interaction.isCommand() && interaction.commandName != "update") 
            await interaction.channel.send({ content: `Welcome to the server ${rblxusername}`, embeds: [embed] })
        if (interaction.isCommand() && interaction.commandName == "update") {
            if (!interaction.deferred) await interaction.reply({ content: `Welcome to the server ${rblxusername}`, embeds: [embed] })
            else await interaction.followUp({ content: `Welcome to the server ${rblxusername}`, embeds: [embed] })
        }
    }
    else {
        if (interaction.isCommand() && interaction.commandName == "update") {
            if (!interaction.deferred) await interaction.reply({ content: `User already up to date` })
            else await interaction.followUp({content: "User already up to date"})
        }
            
    }
}