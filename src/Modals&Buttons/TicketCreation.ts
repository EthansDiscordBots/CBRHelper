import { Client, AwaitModalSubmitOptions, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalSubmitInteraction, ChannelType, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionOverwrites, PermissionsBitField, AllowedMentionsTypes, embedLength, TextChannel } from "discord.js";
import { ticketPermission as permissions } from "../Functions/ticketpermissions";
import * as transcript from "discord-html-transcripts"
import { QuickDB } from "quick.db";
const db = new QuickDB()
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client: Client) {
        if (interaction.isButton() && interaction.customId.includes("TicketOpen")) {
            const modal = new ModalBuilder()
                .setTitle("Ticket Creation")
            const modalComponents = []
            if (interaction.customId == "TicketOpenGeneral") {
                const Openreason = new TextInputBuilder()
                    .setCustomId("Open Reason")
                    .setPlaceholder("What are CBR's alliance requirements.")
                    .setLabel("What is your reason for opening a ticket?")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                modal.addComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(Openreason),
                )
            }
            else if (interaction.customId == "TicketOpenSupport") {
                const Openreason = new TextInputBuilder()
                    .setCustomId("Open Reason")
                    .setPlaceholder("Report an LR")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setLabel("What is your reason for opening a ticket?")
                modal.addComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(Openreason),
                )
            }
            else if (interaction.customId == "TicketOpenReport") {
                const Username = new TextInputBuilder()
                    .setCustomId("Member Username")
                    .setLabel("Member being reported's username?")
                    .setPlaceholder("Scr1ptxd_Ethxn")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                const memberRank = new TextInputBuilder()
                    .setCustomId("Member rank")
                    .setLabel("Member being reported's rank?")
                    .setPlaceholder("Developer")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                const Openreason = new TextInputBuilder()
                    .setCustomId("Reason")
                    .setPlaceholder("Admin Abuse")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setLabel("Reason for report.")
                const proof = new TextInputBuilder()
                    .setCustomId("Proof")
                    .setPlaceholder("In ticket")
                    .setRequired(true)
                    .setLabel("Proof of this happening.")
                    .setStyle(TextInputStyle.Short)
                modal.addComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(Username),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(memberRank),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(Openreason),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(proof)

                )
            }
            else if (interaction.customId == "TicketOpenBug") {
                const Openreason = new TextInputBuilder()
                    .setCustomId("Bug description")
                    .setPlaceholder("The nametag doesnt show in game.")
                    .setRequired(true)
                    .setLabel("Please describe the bug.")
                    .setStyle(TextInputStyle.Short)
                const Replication = new TextInputBuilder()
                    .setCustomId("Bug replication")
                    .setPlaceholder("I walk in to this little wall (ss in ticket) and the nametag disappears")
                    .setLabel("How do you replicate this bug?")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                modal.addComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(Openreason),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(Replication)
                )
            }


            modal.setCustomId(interaction.customId)
            interaction.showModal(modal)
        }

        if (interaction.isModalSubmit() && interaction.customId.includes("TicketOpen")) {
            const useropened = interaction.user
            let ticket
            if (interaction.customId == "TicketOpenGeneral") {
                ticket = await interaction.guild.channels.create({
                    name: `❓│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: "1140035354347438210",
                    permissionOverwrites: permissions(useropened, interaction),
                });
                await db.set(`Ticket${ticket.id}.Type`, `General Support`)
            }
            else if (interaction.customId == "TicketOpenSupport") {
                ticket = await interaction.guild.channels.create({
                    name: `✋│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: "1140035493862576148",
                    permissionOverwrites: permissions(useropened, interaction),
                });
                await db.set(`Ticket${ticket.id}.Type`, `Hotel Support`)
            }
            else if (interaction.customId == "TicketOpenReport") {
                ticket = await interaction.guild.channels.create({
                    name: `📋│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: "1140035861333950515",
                    permissionOverwrites: permissions(useropened, interaction),
                });
                await db.set(`Ticket${ticket.id}.Type`, `Management Report`)
            }
            else if (interaction.customId == "TicketOpenBug") {
                ticket = await interaction.guild.channels.create({
                    name: `⚠️│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: "1140035913137799238",
                    permissionOverwrites: permissions(useropened, interaction),
                });
                await db.set(`Ticket${ticket.id}.Type`, `Bug Report`)
            }
            await db.set(`Ticket${ticket.id}.Creator`, `<@${useropened.id}>`)
            await db.set(`Ticket${ticket.id}.CreatedAt`, `<t:${Math.floor(Date.now() / 1000)}:f>`)
            const replyEmbed = new EmbedBuilder()
                .setDescription(`Ticket <#${ticket.id}> has been created.`)

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })

            const channelembed = new EmbedBuilder()
                .setTitle("A new ticket has been made!")
                .setDescription("Thank you for contacting support.\nPlease describe your issue and await a response.")
                .setColor(0x00ffe5)
            const claiming = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("Claim")
                        .setLabel("Claim")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji("📋"),
                    new ButtonBuilder()
                        .setCustomId("Close")
                        .setEmoji("🔒")
                        .setLabel("Close")
                        .setStyle(ButtonStyle.Danger)
                )
            const secondchan = new EmbedBuilder()
                .setColor(0x00ffe5)

            for (let i = 0; i < interaction.fields.fields.map(m => m).length; i++) {
                const field = interaction.fields.fields.map(m => m)[i]
                secondchan.addFields({ name: field.customId, value: field.value })
            }
            ticket.send({ embeds: [channelembed, secondchan], components: [claiming] })
        }

        if (interaction.isButton() && interaction.customId == "Claim") {
            const i = interaction
            const y = i.channel.name.split("│")
            var ttt
            await i.guild.members.fetch().then(async fetchedMembers => {
                const totalOnline = fetchedMembers.filter(member => member.user.tag == y[1]);
                if (totalOnline.map(m => m).length > 0) {
                    if (totalOnline.map(m => m.user.id)[0] == i.user.id) {
                        ttt = true
                    }
                }
            });
            //if (ttt) return await i.reply({ content: "You cannot claim your own ticket!", ephemeral: true })
            i.channel.setName(`claimed│${y[1]}`)
            i.channel.permissionOverwrites.edit("1098282647547023430", { SendMessages: false })
            i.channel.permissionOverwrites.edit("1098282737011531806", { SendMessages: false })
            i.channel.permissionOverwrites.edit("1098282927315505262", { SendMessages: false })
            i.channel.permissionOverwrites.edit(i.user.id, { SendMessages: true })
            const embeds = new EmbedBuilder()
                .setDescription(`This ticket has been claimed by <@${i.user.id}>`)
                .setColor(0x00ffe5)
            i.reply({ embeds: [embeds] })
            await db.set(`Ticket${i.channel.id}.ClaimedBy`, `<@${interaction.user.id}>`)
        }

        if (interaction.isButton() && interaction.customId == "Close") {
            const i = interaction
            await i.channel.permissionOverwrites.delete(i.guild.roles.cache.get("1098282647547023430"))
            await i.channel.permissionOverwrites.delete(i.guild.roles.cache.get("1098282737011531806"))
            await i.channel.permissionOverwrites.delete(i.guild.roles.cache.get("1098282927315505262"))
            const y = i.channel.name.split("│")
            i.channel.setName(`closed│${y[1]}`)
            i.guild.members.fetch().then(async fetchedMembers => {
                const totalOnline = fetchedMembers.filter(member => member.user.tag == y[1]);
                if (totalOnline.map(m => m).length > 0) await i.channel.permissionOverwrites.delete(totalOnline.map(m => m.user.id)[0])
            });
            const reasonModal = new ModalBuilder()
                .setCustomId("ReasonSetModal")
                .setTitle("Set reason")

            const rblxuser = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("What is the reason for closing the ticket?")
                .setRequired(false)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Issue resolved.")
            await db.set(`Ticket${interaction.channel.id}.ClosedBy`, `<@${interaction.user.id}>`)
            const mcom = new ActionRowBuilder<TextInputBuilder>().addComponents(rblxuser)
            reasonModal.addComponents(mcom)
            i.showModal(reasonModal)
        }

        if (interaction.isModalSubmit() && interaction.customId == "ReasonSetModal") {
            await db.set(`Ticket${interaction.channel.id}.CloseReason`, interaction.fields.getTextInputValue("reason"))
            const newe = new EmbedBuilder()
                .setTitle("Ticket closed")
                .setDescription("This ticket has been closed, would you like to delete the channel?")
                .setColor(0x00ffe5)
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("ConfirmDel")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Delete")
                        .setEmoji("🗑")
                )
            interaction.reply({ embeds: [newe], components: [row] })
        }

        if (interaction.isButton() && interaction.customId == "ConfirmDel") {
            const i = interaction
            await i.reply("Deleting channel...");
            const channel: TextChannel = i.channel
            const transcriptfile = await transcript.createTranscript(channel)

            const CreatedBy = await db.get(`Ticket${i.channel.id}.Creator`) ?? "N/A"
            const CreatedAt = await db.get(`Ticket${interaction.channel.id}.CreatedAt`) ?? "N/A"
            const ClaimedBy = await db.get(`Ticket${i.channel.id}.ClaimedBy`) ?? "N/A"
            const TicketType = await db.get(`Ticket${interaction.channel.id}.Type`) ?? "N/A"
            const closedBy = await db.get(`Ticket${interaction.channel.id}.ClosedBy`) ?? "N/A"
            const closeReason = await db.get(`Ticket${interaction.channel.id}.CloseReason`) ?? "N/A"

            const transcriptembed = new EmbedBuilder()
                .setTitle("Ticket Closed")
                .addFields(
                    { name: "Opened by", value: CreatedBy, inline: true },
                    { name: "Claimed by", value: ClaimedBy, inline: true },
                    { name: "Created at", value: CreatedAt, inline: true },
                    { name: "Closed by", value: closedBy, inline: true },
                    { name: "Ticket Type", value: TicketType, inline: true },
                    { name: "Close reason", value: closeReason }
                )
                .setColor(0x00ffe5)

            const message = await client.channels.cache.get("1273348453304635423")?.send({ files: [transcriptfile] })
            const transcripturl = await message.attachments.first().url
            const transcriptbutton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(transcripturl)
                        .setLabel("Download file")
                )

            client.channels.cache.get("1273339279891763230")?.send({ embeds: [transcriptembed], components: [transcriptbutton] })
            await db.delete(`Ticket${interaction.channel.id}`)
            channel.delete()
            
        }
    }
}