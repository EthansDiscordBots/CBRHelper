import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, InteractionType, ComponentType, Events } from "discord.js";
const date = new Date()
import { getPlayerThumbnail } from "noblox.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client: Client) {
        if (interaction.isButton() && interaction.customId == "DepartmentSelect") {
            const embed = new EmbedBuilder()
                .setDescription(`# Department Selection

** <:VerifiedCheck:1282063794205360148> Choose Your Department**

Please select your preferred department below. You may choose only one, and note that switching departments is only allowed after one month.

- Operations
- Human Resources
- Communications

Select your department using the buttons below!`)
                .setColor(0x00ffe5)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("Human Resources")
                        .setEmoji("<:StaffIcon:1282062858225455266>")
                        .setLabel("Human Resources Department")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(await db.get("HRCan.disabled")),
                    new ButtonBuilder()
                        .setCustomId("Operations")
                        .setEmoji("🎓")
                        .setLabel("Operations Department")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(await db.get("OpsCan.disabled")),
                    new ButtonBuilder()
                        .setCustomId("Communications")
                        .setEmoji("<:TicketIcon:1282063702807412766>")
                        .setLabel("Communications")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(await db.get("CommsCan.disabled"))
                )

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
        }
        const i = interaction
        const HRRoleId = "1130868330627088386"
        const opsroleid = "1130868364445757553"
        const commsroleid = "1130868393713619064"
        if (interaction.isButton() && interaction.customId == "Operations") {
            if (!i.member.roles.cache.get(opsroleid) && !i.member.roles.cache.get(HRRoleId) && !i.member.roles.cache.get(commsroleid)) {
                await i.member.roles.add(opsroleid)
                await i.reply({ content: "You have successfully been given the Operations candidate role.", ephemeral: true })
            }
            else if (!i.member.roles.cache.get(opsroleid) && i.member.roles.cache.get(HRRoleId)) {
                await i.member.roles.add(opsroleid)
                await i.member.roles.remove(HRRoleId)
                await i.reply({ content: "You have successfully been given the Operations candidate role and removed from the Human Resources candidate role.", ephemeral: true })
            }
            else if (!i.member.roles.cache.get(opsroleid) && i.member.roles.cache.get(commsroleid)) {
                await i.member.roles.add(opsroleid)
                await i.member.roles.remove(commsroleid)
                await i.reply({ content: "You have successfully been given the Operations candidate role and removed from the Communications candidate role.", ephemeral: true })
            }
            else {
                i.member.roles.remove(opsroleid)
                await i.reply({ content: "You have successfully been removed from the Operations candidate role.", ephemeral: true })
            }
        }
        else if (interaction.isButton() && interaction.customId == "Human Resources") {
            if (!i.member.roles.cache.get(HRRoleId) && !i.member.roles.cache.get(opsroleid) && !i.member.roles.cache.get(commsroleid)) {
                await i.member.roles.add(HRRoleId)
                await i.reply({content: "You have successfully been given the Human Resources candidate role.", ephemeral: true})
            }
            else if (!i.member.roles.cache.get(HRRoleId) && i.member.roles.cache.get(opsroleid)) {
                await i.member.roles.add(HRRoleId)
                await i.member.roles.remove(opsroleid)
                await i.reply({content: "You have successfully been given the Human Resources candidate role and removed from the Operations candidate role.", ephemeral: true})
            }
            else if (!i.member.roles.cache.get(HRRoleId) && i.member.roles.cache.get(commsroleid)) {
                await i.member.roles.add(HRRoleId)
                await i.member.roles.remove(commsroleid)
                await i.reply({content: "You have successfully been given the Human Resources candidate role and removed from the Communications candidate role.", ephemeral: true})
            }
            else {
                i.member.roles.remove(HRRoleId)
                await i.reply({content: "You have successfully been removed from the Human Resources candidate role.", ephemeral: true})
            }
        }
        else if (interaction.isButton() && interaction.customId == "Communications") {
            if (!i.member.roles.cache.get(commsroleid) && !i.member.roles.cache.get(opsroleid) && !i.member.roles.cache.get(HRRoleId)) {
                await i.member.roles.add(commsroleid)
                await i.reply({content: "You have successfully been given the Communications candidate role.", ephemeral: true})
            }
            else if (!i.member.roles.cache.get(commsroleid) && i.member.roles.cache.get(HRRoleId)) {
                await i.member.roles.add(commsroleid)
                await i.member.roles.remove(HRRoleId)
                await i.reply({content: "You have successfully been given the Communications candidate role and removed from the Human Resources candidate role.", ephemeral: true})
            }
            else if (!i.member.roles.cache.get(commsroleid) && i.member.roles.cache.get(opsroleid)) {
                await i.member.roles.add(commsroleid)
                await i.member.roles.remove(opsroleid)
                await i.reply({content: "You have successfully been given the Communications candidate role and removed from the Operations candidate role.", ephemeral: true})
            }
            else {
                await i.member.roles.remove(commsroleid)
                await i.reply({content: "You have successfully been removed from the Communications candidate role.", ephemeral: true})
            }
        }
    }
}