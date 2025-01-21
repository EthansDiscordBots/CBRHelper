import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle, TextChannel, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField, AttachmentBuilder } from "discord.js";
import { ticketPermission as permissions } from "../Functions/ticketpermissions";
import * as transcript from "discord-html-transcripts"
import * as fs from "fs"
import * as path from "path"
module.exports = {
    method: 'get',
    directory: "/transcripts/:id",
    async execute(req, res, client) {
        const ticketId = req.params.id
        const intend = "../Transcripts"
        const endPath = path.join(intend, `${ticketId}.html`)
        if (!fs.existsSync(endPath)) return res.status(404).json()
        res.sendFile()
    },
    discordname: 'interactionCreate',
    async run(interaction, client) {
        if (interaction.isStringSelectMenu() && interaction.customId == "TicketOpen") {
            const modal = new ModalBuilder()
                .setTitle("Ticket Creation")
            const modalComponents = []
            if (interaction.values[0] == "General" || interaction.values[0] == "Communications") {
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
            else if (interaction.values[0] == "Executive" || interaction.values[0] == "SHR" || interaction.values[0] == "Human Resources" || interaction.values[0] == "Operations") {
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
            else if (interaction.values[0] == "Bug") {
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


            modal.setCustomId(interaction.values[0])
            interaction.showModal(modal)
        }
        if (interaction.isModalSubmit() && interaction.customId == "ReasonSetModal") {
            await db.set(`Ticket${(interaction.channel as TextChannel)?.id}.CloseReason`, interaction.fields.getTextInputValue("reason"))
            const newe = new EmbedBuilder()
                .setTitle("Ticket closed")
                .setDescription("This ticket has been closed, would you like to delete the channel?")
                .setColor(0x00ffe5)
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("ConfirmDel")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Delete")
                        .setEmoji("🗑")
                )
            interaction.reply({ embeds: [newe], components: [row] })
        }

        if (interaction.isModalSubmit()) {
            const useropened = interaction.user
            let ticket

            if (interaction.customId == "General") {
                ticket = await interaction.guild?.channels.create({
                    name: `❓│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: process.env.GeneralTicketCat,
                    permissionOverwrites: permissions(useropened, interaction),
                });
                await db.set(`Ticket${ticket.id}.Type`, `General Support`)
            }

            else if (interaction.customId == "Communications") {
                ticket = await interaction.guild?.channels.create({
                    name: `✋│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: process.env.SupportTicketCat,
                    permissionOverwrites: [{
                            id: process.env.MainServerComms as string,
                            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                        },
                    ],
                });
                await db.set(`Ticket${ticket.id}.Type`, `Communications`)
            }

            else if (interaction.customId == "Executive") {
                ticket = await interaction.guild?.channels.create({
                    name: `📋│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: process.env.ReportTicketCat,
                    permissionOverwrites: [{
                        id: process.env.MAINSHR as string,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                    }],
                });
                await db.set(`Ticket${ticket.id}.Type`, `Executive Report`)
            }

            else if (interaction.customId == "SHR") {
                ticket = await interaction.guild?.channels.create({
                    name: `⚠️│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: process.env.ReportTicketCat,
                });
                await db.set(`Ticket${ticket.id}.Type`, `SHR Report`)
            }

            else if (interaction.customId == "Bug") {
                ticket = await interaction.guild?.channels.create({
                    name: `⚠️│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: process.env.BugTicketCat,
                    permissionOverwrites: [{
                        id: process.env.MAINDEV as string,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                    }]
                });
                await db.set(`Ticket${ticket.id}.Type`, `Bug Report`)
            }
            else if (interaction.customId == "Human Resources") {
                ticket = await interaction.guild?.channels.create({
                    name: `⚠️│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: process.env.ReportTicketCat,
                    permissionOverwrites: [{
                        id: process.env.MainServerHRD as string,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                    }]
                });
                await db.set(`Ticket${ticket.id}.Type`, `Main Game Report`)
            }
            else if (interaction.customId == "Operations") {
                ticket = await interaction.guild?.channels.create({
                    name: `⚠️│${useropened.tag}`,
                    type: ChannelType.GuildText,
                    parent: process.env.ReportTicketCat,
                    permissionOverwrites: [{
                        id: process.env.MainServerOps as string,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                    }]
                });
                await db.set(`Ticket${ticket.id}.Type`, `Training Centre Report`)
            }
            else return
            await db.set(`Ticket${ticket.id}.Creator`, useropened.id)
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
            ticket.permissionOverwrites.edit(interaction.user.id, { SendMessages: true, ViewChannel: true})
            ticket.permissionOverwrites.edit(interaction.guild?.roles.everyone, {ViewChannel: false})
        }

        if (interaction.isButton() && interaction.customId == "Claim") {
            const i = interaction
            const y = (i.channel as TextChannel)?.name.split("│")
            var ttt
            await i.guild?.members.fetch().then(async fetchedMembers => {
                const totalOnline = fetchedMembers.filter(member => member.user.tag == y[1]);
                if (totalOnline.map(m => m).length > 0) {
                    if (totalOnline.map(m => m.user.id)[0] == i.user.id) {
                        ttt = true
                    }
                }
            });
            //if (ttt) return await i.reply({ content: "You cannot claim your own ticket!", ephemeral: true })
            
            (i.channel as TextChannel)?.setName(`claimed│${y[1]}`);
            (i.channel as TextChannel)?.permissionOverwrites.edit(process.env.EARole as string, { SendMessages: false });
            (i.channel as TextChannel)?.permissionOverwrites.edit(process.env.EORole as string, { SendMessages: false });
            (i.channel as TextChannel)?.permissionOverwrites.edit(process.env.SEORole as string, { SendMessages: false });
            (i.channel as TextChannel)?.permissionOverwrites.edit(i.user.id, { SendMessages: true });
            const embeds = new EmbedBuilder()
                .setDescription(`This ticket has been claimed by <@${i.user.id}>`)
                .setColor(0x00ffe5)
            i.reply({ embeds: [embeds] })
            await db.set(`Ticket${i.channel?.id}.ClaimedBy`, `<@${interaction.user.id}>`)
        }

        if (interaction.isButton() && interaction.customId == "Close") {
            const i = interaction
            await (i.channel as TextChannel)?.permissionOverwrites.delete(process.env.EARole as string)
            await (i.channel as TextChannel)?.permissionOverwrites.delete(process.env.EORole as string)
            await (i.channel as TextChannel)?.permissionOverwrites.delete(process.env.SEORole as string)
            const y = (i.channel as TextChannel)?.name.split("│");
            (i.channel as TextChannel)?.setName(`closed│${y[1]}`)
            await (i.channel as TextChannel)?.permissionOverwrites.delete(await db.get(`Ticket${i.channelId}.Creator`) as string)
            const reasonModal = new ModalBuilder()
                .setCustomId("ReasonSetModal")
                .setTitle("Set reason")

            const rblxuser = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("What is the reason for closing the ticket?")
                .setRequired(false)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Issue resolved.")
            await db.set(`Ticket${(i.channel as TextChannel)?.id}.ClosedBy`, `<@${interaction.user.id}>`)
            const mcom = new ActionRowBuilder<TextInputBuilder>().addComponents(rblxuser)
            reasonModal.addComponents(mcom)
            i.showModal(reasonModal)
        }

        if (interaction.isButton() && interaction.customId == "ConfirmDel") {
            const i = interaction
            await i.reply("Deleting channel...");
            const channel = i.channel as TextChannel
            const transcriptfile = await transcript.createTranscript(channel, {
                limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
                returnType: transcript.ExportReturnType.Attachment, // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
                filename: 'transcript.html', // Only valid with returnType is 'attachment'. Name of attachment.
                saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
                footerText: "Exported {number} message{s}", // Change text at footer, don't forget to put {number} to show how much messages got exported, and {s} for plural
                poweredBy: false, // Whether to include the "Powered by discord-html-transcripts" footer
            })
            const transcriptname = `${interaction.channel.id}.html`
            const filePath = "../Transcripts"
            const endpath = path.join(filePath, transcriptname)
            fs.writeFileSync(endpath, transcriptfile, "utf8")


            const CreatedBy = await db.get(`Ticket${(interaction.channel as TextChannel)?.id}.Creator`) ?? "N/A"
            const CreatedAt = await db.get(`Ticket${(interaction.channel as TextChannel)?.id}.CreatedAt`) ?? "N/A"
            const ClaimedBy = await db.get(`Ticket${(interaction.channel as TextChannel)?.id}.ClaimedBy`) ?? "N/A"
            const TicketType = await db.get(`Ticket${(interaction.channel as TextChannel)?.id}.Type`) ?? "N/A"
            const closedBy = await db.get(`Ticket${(interaction.channel as TextChannel)?.id}.ClosedBy`) ?? "N/A"
            const closeReason = await db.get(`Ticket${(interaction.channel as TextChannel)?.id}.CloseReason`) ?? "N/A"

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
            const transcriptbutton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://cbr.ethansrandomthings/transcripts/${interaction.channel.id}`)
                        .setLabel("Download file")
                )

            client.channels.cache.get(process.env.TranscriptsInMain as string)?.send({ embeds: [transcriptembed], components: [transcriptbutton] })
            await db.delete(`Ticket${(interaction.channel as TextChannel)?.id}`)
            channel.delete()
            
        }
    }
}
