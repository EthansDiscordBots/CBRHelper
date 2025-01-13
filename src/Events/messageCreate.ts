import { Events, MessageType, ChannelType, EmbedBuilder, AllowedMentionsTypes, ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js"
import * as rbx from "noblox.js"
import { QuickDB } from "quick.db"
const db = new QuickDB()
import { getIdFromUsername } from "../Functions/getIdFromUsername"
import { Client } from "marcsync"
import { retryOperation } from "../Functions/retry"
const ms = new Client(String(process.env.mskey))
import { EIEmbed } from "../Functions/SendEIEmbed"
const appchannels = ["1295472125809000541", "1295472059706507428", "1295471814402768906", "1132683214964658197", "1130750286768644126", "1132230548576817282"]
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
                if (message.channel.id !== "1130750286768644126") {
                    message.startThread({
                        name: "Discuss"
                    })
                }
            }
            else if (message.author.id == "1214683905857429546") {
                await rbx.setCookie(String(process.env.cookie))
                const msg = message.content.split(" ")
                const id = Number(await getIdFromUsername(msg[0]))
                await new Promise(r => setTimeout(r, 1000))
                if (id) {
                    try {
                        console.log(Number(msg[1]))
                        if (Number(msg[1])) {
                            await rbx.setRank(Number(process.env.groupId), id, Number(msg[1]))
                            message.react("✅")
                        }
                    }
                    catch {
                        message.react("❌")
                    }
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
            else if (message.author.id == "1141342041272496128" || message.author.id == "1141181131354558464") {
                await rbx.setCookie(String(process.env.cookie))
                const msg = message.content.split(" ")
                const id = Number(await getIdFromUsername(msg[0]))
                await new Promise(r => setTimeout(r, 1000))
                if (id) {
                    try {
                        var cur
                        fetch(`https://groups.roblox.com/v2/users/${id}/groups/roles`).then(async res => {
                            const data = await res.json()
                            data.data.forEach(function (item) {
                                if (item.group.id === Number(process.env.groupId)) {
                                    cur = item.role.id
                                }
                            });
                        })
                        await new Promise(r => setTimeout(r, 1000))
                        console.log(Number(msg[1]))
                        if (msg[1] == "MI") {
                            await rbx.setRank(Number(process.env.groupId), id, 32576993)
                            message.react("✅")
                        }
                        else if (Number(msg[1])) {
                            await rbx.setRank(Number(process.env.groupId), id, Number(msg[1]))
                            message.react("✅")
                        }
                        else if (cur == 31613036 || cur == 31613035 || cur == 100463111) {
                            await rbx.setRank(Number(process.env.groupId), id, 32576993)
                            message.react("✅")
                        }
                        else if (cur === 32576993) {
                            if (msg[1].startsWith("House")) {
                                await rbx.setRank(Number(process.env.groupId), id, 85277993)
                                message.react("✅")
                            } else if (msg[1].startsWith("Security")) {
                                await rbx.setRank(Number(process.env.groupId), id, 85278008)
                                message.react("✅")
                            } else if (msg[1].startsWith("Reception")) {
                                await rbx.setRank(Number(process.env.groupId), id, 85274355)
                                message.react("✅")
                            }
                        }
                        else if (cur === 85274355 || cur === 85277993 || cur === 85278008) {
                            await rbx.promote(Number(process.env.groupId), id)
                            message.react("✅")
                        }
                        else if (cur === 31802079) {
                            await rbx.setRank(Number(process.env.groupId), id, 96978263)
                            message.react("✅")
                        }
                        else if (cur === 33451441) {
                            await rbx.setRank(Number(process.env.groupId), id, 96978257)
                            message.react("✅")
                        }
                        else if (cur === 31613077) {
                            await rbx.setRank(Number(process.env.groupId), id, 96978252)
                            message.react("✅")
                        }
                        else {
                            message.react("❌")
                        }
                    }
                    catch (err) {
                        message.react("❌")
                        console.log(err)
                    }
                }
            }
            if (message.guildId === "process.env.MainServerId") {
                if (message.author.bot) return
                if (message.member.roles.cache.get("987085821427466300") || message.member.roles.cache.get("987085792365125722") || message.member.roles.cache.get("1098284216749404351")) {
                    var bal = await db.get(`${message.author.id}.tolog-messages}`)
                    if (!bal) {
                        await db.set(`${message.author.id}.tolog-messages}`, 1)
                    } else if (bal) {
                        await db.add(`${message.author.id}.tolog-messages}`, 1)
                    }
                }
                else if (!message.member.roles.cache.get("987085821427466300") && !message.member.roles.cache.get("987085792365125722") && !message.member.roles.cache.get("1098284216749404351")) {
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
                    if ((await client.guilds.cache.get("process.env.MainServerId").members.fetch(message.author.id)).roles.cache.get("1098284216749404351")) return
                    if (message.author.id == noping[i]) return
                    if (message.mentions.users.get(noping[i]) && (message.mentions.repliedUser?.id || null) != noping[i]) {
                        const VWs = await db.get(`SHRPingVWs.${message.author.id}`) ?? []
                        var modoncallping = `<@&1234609631159124089>`
                        if (VWs.length > 0) {
                            const prevwarnmessages = []
                            for (let i = 0; i < VWs.length; i++) {
                                prevwarnmessages.push(`https://discord.com/channels/process.env.MainServerId/${VWs[i].channel}/${VWs[i].message}`)
                            }
                            client.channels.cache.get("1232574877207101460").send({ content: `${modoncallping}; user <@${message.author.id}> needs a punishment as they have pinged an SHR after a verbal warning and the SHR has pings disabled.\n${prevwarnmessages.toString()}`, allowedMentions: { parse: [AllowedMentionsTypes.Role] } })
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