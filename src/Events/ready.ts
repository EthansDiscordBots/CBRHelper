import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
const date = new Date()
import { getPlayerThumbnail } from "noblox.js";
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
//        client.guilds.cache.get("1130864207705948162").channels.create({
 //           name: "candidate-closure",
//            type: ChannelType.GuildText,
//            parent: "1132201402769362965",
//            permissionOverwrites: [
 //               {
 //                   id: "1130871316090732674",
 //                   allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
//                },
 //               {
 //                   id: client.guilds.cache.get("1130864207705948162").roles.everyone,
 //                   deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
  //              },
  //          ],
 //       })
 //sendTicketPanel("987089087238373456", client)
        setInterval(() => {

            const array = [
                `${client.guilds.cache.get("480452557949370380").memberCount} amazing people ❤`,
            ];
            let index = 0;
            if (index === array.length) index = 0
            const status = array[index];
            client.user.setPresence({ activities: [{ name: `${status}`, type: ActivityType.Watching }]});
            index++
        }, 5000);
        console.log('Ready!');
        console.log(`Logged in as ${client.user.tag}`)
    }
}