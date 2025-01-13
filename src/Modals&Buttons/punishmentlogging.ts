import { TextInputStyle, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, InteractionType, ComponentType, Events, Role, Options, EmbedBuilder, Interaction, TextChannel, underline, StartThreadOptions } from "discord.js";
const date = new Date()
import { QuickDB } from "quick.db";
const db = new QuickDB()
import { getIdFromUsername, getUsernameFromId } from "../Functions/getIdFromUsername";
import { getPunishmentFormat } from "../Functions/getPunishmentFormat";
import { getRoleInGroup } from "../Functions/getRoleInGroup";
import { setRank } from "../Functions/setRank";
import { Client as MarcSyncClient } from "marcsync"
import { retryOperation } from "../Functions/retry";
const ms = new MarcSyncClient(process.env.mskey as string)
const blacklistcol = ms.getCollection("Blacklisted")
module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (interaction.isModalSubmit() && interaction.customId.split("-")[0] == "Punishment") {
            const menu = new StringSelectMenuBuilder()
                .setCustomId(interaction.customId)
                .setPlaceholder("Select punishment type.")
                .setOptions([
                    {
                        label: "Reminder",
                        value: "Reminder"
                    },
                    {
                        label: "Warning",
                        value: "Warning"
                    },
                    {
                        label: "Demotion",
                        value: "Demotion"
                    },
                ])
            if (interaction.channel?.id == "1130750245370875994") {
                menu.addOptions([
                    {
                        label: "Termination - No Blacklist",
                        value: "Termination - NB"
                    },
                    {
                        label: "Termination - Blacklist",
                        value: "Termination - Blacklist"
                    }
                ])
            }
            else {
                menu.addOptions([
                    {
                        label: "Termination",
                        value: "Termination"
                    }
                ])
            }
            const userID = await getIdFromUsername(interaction.fields.getTextInputValue("Member Username"))
            if (!userID) return await interaction.reply({ content: "User not found.", ephemeral: true })
            const userdata = await getUsernameFromId(await db.get(`${interaction.user.id}.verifiedRoblox`) as string)
            await db.set(interaction.customId, {
                Involved: {
                    name: interaction.fields.getTextInputValue("Member Username"),
                    id: userID
                },
                Department: interaction.channel?.id == "1130750245370875994" ? "Human Resources" : "Operations",
                Reason: interaction.fields.getTextInputValue("Reason"),
                IssuerData: {
                    name: userdata.name,
                    displayName: userdata.displayName,
                    rankInGroup: (await getRoleInGroup(process.env.groupId, await db.get(`${interaction.user.id}.verifiedRoblox`) as string)).RankName
                }
            })
            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription("Please select punishment type.").setColor("Green")], components: [row], ephemeral: true })
        }

        if (interaction.isStringSelectMenu() && interaction.customId.split("-")[0] == "Punishment") {
            await db.set(`${interaction.customId}.Punishment`, interaction.values[0])

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`A${interaction.customId}`)
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Approve punishment"),
                new ButtonBuilder()
                    .setCustomId(`D${interaction.customId}`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Deny punishment")
            )

            const data = await db.get(interaction.customId)
            const embed = new EmbedBuilder()
                .addFields(
                    {
                        name: "User involved",
                        value: `${data.Involved.name} // ${data.Involved.id}`,
                    },
                    {
                        name: "Punisher",
                        value: `${data.IssuerData.displayName} (@${data.IssuerData.name}) | <@${interaction.user.id}>`
                    },
                    {
                        name: "Punishment",
                        value: `${data.Punishment}`
                    },
                    {
                        name: "Reason",
                        value: data.Reason
                    }
                )
                .setFooter({ text: "Evidence is to be submitted in the thread below." })
                .setColor(0x00ffe5)

            await interaction.update({ embeds: interaction.message.embeds, components: [] })
            await (interaction.channel as TextChannel).send({ embeds: [embed], components: [row] }).then(async msg => {
                await msg.startThread({ name: "Proof" })
            })
        }

        if (interaction.isButton() && (interaction.customId.split("-")[0] == "APunishment" || interaction.customId.split("-")[0] == "DPunishment")) {
            const oldembed = interaction.message.embeds[0]
            const punishmentid = interaction.customId.slice(1)
            const punishmentdata = await db.get(punishmentid)
            const membertodm = await db.get(`${punishmentdata.Involved.id}.discordId`)
            let embed = new EmbedBuilder()
                .setFooter(oldembed.footer)
                .setFields(oldembed.fields)
            if (interaction.customId.slice(0, 1) == "A") {
                embed.setColor("Green")
                let messageformat: string = await getPunishmentFormat(punishmentdata.Department, punishmentdata.Punishment)
                messageformat = messageformat.replace("DISCORDUSER", `<@${membertodm}>`)
                    .replace("PUNISHERUSER", punishmentdata.IssuerData.name)
                    .replace("PUNISHERRANK", punishmentdata.IssuerData.rankInGroup)
                    .replace("PUNISHMENTREASON", punishmentdata.Reason)
                if ((await getRoleInGroup(process.env.groupId, punishmentdata.Involved.id)).rank > 30) {
                    const member = await client.guilds.cache.get("process.env.MainServerId")?.members.fetch(membertodm)
                    if (!member) await interaction.reply({ content: "This member is not within the main discord server, DM notice not sent. Any other actions (eg demotion/termination) (should have been) completed. (DEMOTION NOT YET ADDED)", ephemeral: true })
                    else {
                        await interaction.reply({ content: "User has been DMd, and any other actions (eg blacklist/termination) (should have been) completed.", ephemeral: true })


                        switch (punishmentdata.Punishment) {
                            case "Termination":
                                await setRank(process.env.cookie, process.env.groupId, punishmentdata.Involved.id, 1)
                            case "Termination - NB":
                                await setRank(process.env.cookie, process.env.groupId, punishmentdata.Involved.id, 1)
                            case "Termination - Blacklist":
                                await setRank(process.env.cookie, process.env.groupId, punishmentdata.Involved.id, 1)
                                await retryOperation(async function () {
                                    return await blacklistcol.getEntries({ userId: punishmentdata.Involved.id })
                                }).then(async result => {
                                    if (result.length == 1) {
                                        let placetoblin
                                        for (let i = 0; i < result.length; i++) {
                                            for (const [key, value] of Object.entries(result[i].data)) {
                                                if (key != "_id") {
                                                    placetoblin = value == "Application centre" ? "Rank centre" : "Application centre"
                                                }
                                            }
                                        }
                                        await retryOperation(async function () {
                                            await blacklistcol.createEntry({ userId: punishmentdata.Involved.id, place: placetoblin, reason: punishmentdata.Reason })
                                        })
                                    }
                                    if (result.length == 0) {
                                        await retryOperation(async function () {
                                            await blacklistcol.createEntry({ userId: punishmentdata.Involved.id, place: "Application centre", reason: punishmentdata.Reason })
                                        })
                                        await retryOperation(async function () {
                                            await blacklistcol.createEntry({ userId: punishmentdata.Involved.id, place: "Rank centre", reason: punishmentdata.Reason })
                                        })
                                    }
                                })
                            case "Demotion":
                                const playercurrentrank = await getRoleInGroup(process.env.groupId, punishmentdata.Involved.id)
                                const roles = (await (await fetch("https://groups.roblox.com/v1/groups/4720080/roles")).json()).roles
                                const rolepos = roles.find(r => r.name == playercurrentrank.RankName && r.rank == playercurrentrank.rank)
                                const newrole = roles[roles.indexOf(rolepos) - 1]
                                messageformat = messageformat.replace("OLDRANK", playercurrentrank.RankName).replace("NEWRANK", newrole.name)

                                await setRank(process.env.cookie, process.env.groupId, punishmentdata.Involved.id, newrole.id)
                        }
                        member.send({ content: messageformat })
                    }
                }
                else {
                    await interaction.reply({ content: "This member is below management, dm notice not sent. Any other actions (eg demotion/termination) (should have been) completed.", ephemeral: true })
                }
            }
            else {
                embed.setColor("Red")
            }
            await interaction.message.edit({ embeds: [embed], components: [] })
        }
    }
}

