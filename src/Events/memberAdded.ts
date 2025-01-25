import { ActivityType, PresenceUpdateStatus, PermissionsBitField, Collection, EmbedBuilder, Events, Embed, Invite, Guild, Client } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()
const guildInvites = new Collection();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.guilds.cache.forEach(async (guild) => {
            try {
                const invites = await guild.invites.fetch();
                guildInvites.set(guild.id, invites);
            } catch (error) {
                console.error(`Error fetching invites for guild ${guild.id}:`, error);
            }
        });

        client.on(Events.GuildMemberAdd, async member => {
            if (member.guild.id != process.env.MainServerId) return
            if (member.bot) return
            let usedInvite
            try {
                const storedInvites = guildInvites.get(member.guild.id) as Collection<string, Invite>;
                const currentInvites = await member.guild.invites.fetch();

                usedInvite = currentInvites.find((inv) =>
                    storedInvites.has(inv.code) &&
                    inv.uses > (storedInvites.get(inv.code)?.uses || 0)
                );

                if (usedInvite) {
                    console.log(`${member.user.tag} joined using invite ${usedInvite.code} created by ${usedInvite.inviter.tag}.`);
                    guildInvites.set(member.guild.id, currentInvites);
                } else {
                    console.log(`${member.user.tag} joined, but the invite couldn't be tracked.`);
                }
            } catch (error) {
                console.error(`Error tracking invite for ${member.user.tag}:`, error);
            }
            await db.add(`${usedInvite.inviter.id}.invites`, 1)
            const embed = new EmbedBuilder()
                .setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                .setColor(0x00ffe5)
                .setTimestamp()
                .setDescription(`Welcome to Crystal Bay Resorts <@${member.user.id}>! We hope you enjoy it here! Want to apply for a possible HR rank? Visit <#1133077886929219727>!`)
            
            if (usedInvite.inviter && !usedInvite.inviter.bot) embed.setFooter({text: `You was invited by <@${usedInvite.inviter.id}> and they now have a total of ${await db.get(`${usedInvite.inviter.id}.invites`)} invites.`})
            client.channels.cache.get("1140348271563386940").send({ content: `<@${member.user.id}>`, embeds: [embed] })
        })

        client.on(Events.InviteCreate, async invite => {
            try {
                const invites = await invite.guild.invites.fetch();
                guildInvites.set(invite.guild.id, invites);
              } catch (error) {
                console.error(`Error updating invites for guild ${invite.guild.id}:`, error);
              }
        })
        client.on(Events.InviteDelete, async (invite) => {
            try {
              const invites = await invite.guild.invites.fetch();
              guildInvites.set(invite.guild.id, invites);
            } catch (error) {
              console.error(`Error removing invite for guild ${invite.guild.id}:`, error);
            }
          });
    }
}