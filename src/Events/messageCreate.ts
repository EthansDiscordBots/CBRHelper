import { Events, MessageType, ChannelType, EmbedBuilder, AllowedMentionsTypes, ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js"
import * as rbx from "noblox.js"
import { QuickDB } from "quick.db"
const db = new QuickDB()
import { getIdFromUsername } from "../Functions/getIdFromUsername"
import { Client } from "marcsync"
import { retryOperation } from "../Functions/retry"
const ms = new Client(String(process.env.mskey))
import { EIEmbed } from "../Functions/SendEIEmbed"
const appchannels = [process.env.HRDApplication, process.env.OpsApplication, process.env.CommsApplication, process.env.MRAppealForms, process.env.PromotionVoting, process.env.AppealVoting]
import * as cron from "node-cron"

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.on(Events.MessageCreate, async message => {
            if (message.content.toLowerCase().startsWith("-eval")) {
                if (message.author.id != "849729544906997850") return message.reply("This command is restricted to the bot owner only, and can not be executed by anyone else.");
                var result = message.content.split(" ").slice(1).join(" ");

                try {
                    if (message.channel.type != ChannelType.DM) message.delete().catch(e => console.log("Message already deleted."));

                    result = result.replace(/”/g, '"').replace(/“/g, '"')

                    await eval(`
                    (async () => { 
                    const msg = message
                    ${result}
                    })()`);
                    const Embed = new EmbedBuilder()
                        .setTitle("Code executed")
                        .setDescription(`The code: \`\`\`js\n${result}\n\`\`\` has successfully been executed.`)
                    message.channel.send({ embeds: [Embed] });
                } catch (error) {
                    if (message.channel.type != ChannelType.DM) message.delete().catch(e => console.log("Message already deleted."));
                    const Embed = new EmbedBuilder()
                        .setTitle("Code error!")
                        .setDescription(`The code: \`\`\`js\n${result}\n\`\`\` has returned the following error:\n\`\`\`${error}.\`\`\``)
                    message.channel.send({ embeds: [Embed] });
                }
            }
            else if (message.content.toLowerCase().startsWith("-resetservers") && (message.author.id == "849729544906997850" || message.author.id == "320927674673397760")) {
                async function s() {
                    ms.getCollection("Trainings").updateEntryById("661716d7b005baa1fa9deac7", { ServersOpened: 0 })
                }

                retryOperation(s)
                    .catch(err => console.error("Set serversopened to 0 failed", err))
            }
            else if (message.content.toLowerCase().startsWith("-eiembed") && (message.author.id == "849729544906997850" || message.author.id == "320927674673397760")) {
                await EIEmbed(client, message.content.split(" ")[1])
            }
            else if (message.content.toLowerCase().startsWith("-newgoal") && (message.author.id == "849729544906997850" || message.author.id == "320927674673397760")) {
                const newgoal = Number(message.content.split(" ")[1])
                db.set("membergoal", newgoal)
                message.react("✅")
            }
            //            else if (message.content.toLowerCase().includes("omg")) message.reply("oh mah gwolly gwosh")
            else if (appchannels.includes(String(message.channel.id))) {
                message.react("✅")
                message.react("❌")
                if (message.channel.id != process.env.PromotionVoting) {
                    message.startThread({
                        name: "Discuss"
                    })
                }
            }
            async function saycmd(mag) {
                if (mag.author.id != "849729544906997850") return mag.reply("This command is restricted to the bot owner only, and can not be executed by anyone else.");
                if (mag.channel.type != ChannelType.DM) mag.delete().catch(e => console.log("Message already deleted."));
                var result = mag.content.split(" ").slice(1).join(" ");
                const attachments = Array.from(mag.attachments.values());
                var typing = cron.schedule("*/1 * * * * *", async () => { 
                    await mag.channel.sendTyping()
                }, {
                    scheduled: true
                  });
                if (result.length > 15) typing.start()
                await new Promise(r => setTimeout(r, result.length * 200))
                await mag.channel.send({ content: result, files: attachments.map(attachment => attachment.url), allowedMentions: { mentions: false, repliedUser: true } })
                typing.stop()
            }
            async function replycmd(msg, msglink) {
                if (msg.author.id != "849729544906997850") return msg.reply("This command is restricted to the bot owner only, and can not be executed by anyone else.");
                if (msg.channel.type != ChannelType.DM) msg.delete().catch(e => console.log("Message already deleted."));
                var result = msg.content.split(" ").slice(2).join(" ");
                const link = msglink.replace(/https:\/\/discord.com\/channels\//g, "").replace(/https:\/\/canary.discord.com\/channels\//g, "").replace(/https:\/\/discordapp.com\/channels\//g, "")
                const guild = await client.guilds.fetch(link.split("/")[0])
                const channel = await guild.channels.fetch(link.split("/")[1])
                const attachments = Array.from(msg.attachments.values());
                var typing = cron.schedule("*/1 * * * * *", async () => { 
                    await channel.sendTyping()
                }, {
                    scheduled: true
                  });
                if (result.length > 15) typing.start()
                await new Promise(r => setTimeout(r, result.length * 200))
                const msgs = await channel.messages.fetch(link.split("/")[2])
                await msgs.reply({ content: result, files: attachments.map(attachment => attachment.url), allowedMentions: { mentions: false, repliedUser: true } })
                typing.stop()
            }
            if (message.content.startsWith("-say")) {
                return await saycmd(message)
            }
            if (message.content.startsWith("-reply")) {
                return await replycmd(message, message.content.split(" ")[1])
            }
            if (message.guildId === process.env.MainServerId) {
                if (message.author.bot) return
                if (message.member.roles.cache.get(process.env.MAINMR) || message.member.roles.cache.get(process.env.MAINHR) || message.member.roles.cache.get(process.env.MAINSHR)) {
                    var bal = await db.get(`${message.author.id}.tolog-messages}`)
                    if (!bal) {
                        await db.set(`${message.author.id}.tolog-messages}`, 1)
                    } else if (bal) {
                        await db.add(`${message.author.id}.tolog-messages}`, 1)
                    }
                }
                else if (!message.member.roles.cache.get(process.env.MAINMR) && !message.member.roles.cache.get(process.env.MAINHR) && !message.member.roles.cache.get(process.env.MAINSHR)) {
                    var balance = await db.get(`${message.author.id}.messages`)
                    if (!balance) {
                        await db.set(`${message.author.id}.messages`, 1)
                    }
                    else if (balance) {
                        await db.add(`${message.author.id}.messages`, 1)
                    }
                }
                interface T { }
                const noping = await db.get("SHRDontPingUsers")
                for (let i = 0; i < noping.length; i++) {
                    if ((await client.guilds.cache.get(process.env.MainServerId).members.fetch(message.author.id)).roles.cache.get(process.env.MAINSHR)) return
                    if (message.author.id == noping[i]) continue
                    if (message.mentions.users.get(noping[i]) && (message.mentions.repliedUser?.id || null) != noping[i]) {
                        if (message.channel.id == process.env.Events) return
                        const VWs = await db.get(`SHRPingVWs.${message.author.id}`) ?? []
                        var modoncallping = `<@&1234609631159124089>`
                        if (VWs.length > 0) {
                            const prevwarnmessages = []
                            for (let i = 0; i < VWs.length; i++) {
                                prevwarnmessages.push(`https://discord.com/channels/${process.env.MainServerId}/${VWs[i].channel}/${VWs[i].message}`)
                            }
                            client.channels.cache.get(process.env.ModChat).send({ content: `${modoncallping}; user <@${message.author.id}> needs a punishment as they have pinged an SHR after a verbal warning and the SHR has pings disabled.\n${prevwarnmessages.toString()}`, allowedMentions: { parse: [AllowedMentionsTypes.Role] } })
                        }
                        else if (VWs.length == 0) {
                            const buttons = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`${message.id}`)
                                        .setLabel("Remove")
                                        .setStyle(ButtonStyle.Success)
                                        .setEmoji("🗑"),
                                    new ButtonBuilder()
                                        .setCustomId("KeepWarn")
                                        .setEmoji("✔")
                                        .setLabel("Keep")
                                        .setStyle(ButtonStyle.Danger)
                                )
                            message.reply({ content: `<@${noping[i]}> does not wish to be pinged, if you ping another SHR member with pings disabled, the moderation department will punish you. This is a verbal warning. The SHR can remove the verbal warning by clicking the button on this message.`, components: [buttons], allowedMentions: { parse: [], reply: true } })
                        }
                        await db.push(`SHRPingVWs.${message.author.id}`, { channel: message.channelId, message: message.id })
                    }
                }
            }
        })
    }
}