import { ActivityType, PresenceUpdateStatus, PermissionsBitField, Collection, EmbedBuilder, Events, Embed, Invite, Guild, Client } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()
const guildInvites = new Collection();



module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        async function cacheInvites(guildId: string) {
            try {
                const guild = client.guilds.cache.get(guildId);
                if (!guild) throw new Error(`Guild ${guildId} not found`);

                const invites = await guild.invites.fetch();
                const inviteData = invites.map((invite) => ({
                    code: invite.code,
                    uses: invite.uses || 0,
                    inviter: invite.inviter
                }));

                await db.set(`invites_${guildId}`, inviteData);
                console.log(`Cached invites for guild ${guildId}`);
            } catch (error) {
                console.error(`Error caching invites for guild ${guildId}:`, error);
            }
        }
        await cacheInvites(process.env.MainServerId as string)
        client.on(Events.GuildMemberAdd, async member => {
            if (member.guild.id != process.env.MainServerId) return
            if (member.bot) return
            let usedInvite
            const guildId = member.guild.id;

            try {
                const storedInvites = await db.get(`invites_${guildId}`) || [];
                const currentInvites = await member.guild.invites.fetch();

                const mappedinvites = currentInvites.map(inv => ({
                    code: inv.code,
                    uses: inv.uses || 0
                }))

                for (let i = 0; i < storedInvites.length; i++) {
                    const invtocheck = (mappedinvites.filter(r => r.code == storedInvites[i].code))[0]
                    if (invtocheck.uses > storedInvites[i].uses) {
                        usedInvite = storedInvites[i]
                        break
                    }
                }

                if (usedInvite) {
                    await cacheInvites(guildId)
                } else {
                    console.log(`${member.user.tag} joined, but the invite couldn't be tracked.`);
                }
            } catch (error) {
                console.error(`Error tracking invite for ${member.user.tag}:`, error);
            }
            if (usedInvite && usedInvite.inviter && !usedInvite.inviter.bot) await db.add(`${usedInvite.inviter.id}.invites`, 1)
            const embed = new EmbedBuilder()
                .setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                .setColor(0x00ffe5)
                .setTimestamp() 
                .setDescription(`Welcome to Crystal Bay Resorts <@${member.user.id}>! We hope you enjoy it here! Want to apply for a possible HR rank? Visit <#1133077886929219727>!`)

            if (usedInvite && usedInvite.inviter && !usedInvite.inviter.bot) embed.setFooter({ text: `You was invited by <@${usedInvite.inviter.id}> and they now have a total of ${await db.get(`${usedInvite.inviter.id}.invites`)} invites.` })
            client.channels.cache.get("1140348271563386940").send({ content: `<@${member.user.id}>`, embeds: [embed] })
        })

        client.on(Events.InviteCreate, async invite => {
            try {
                const guildId = invite.guild.id;
                await cacheInvites(guildId);
              } catch (error) {
                console.error(`Error updating invites for guild ${invite.guild.id}:`, error);
              }
        })
        client.on(Events.InviteDelete, async (invite) => {
            try {
                const guildId = invite.guild.id;
                await cacheInvites(guildId);
              } catch (error) {
                console.error(`Error removing invite for guild ${invite.guild.id}:`, error);
              }
        });
    }
}