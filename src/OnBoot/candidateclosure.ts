import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";
import {QuickDB} from "quick.db"
const db = new QuickDB
const eiannchan = "1206773441534107738"
const departmentrolemsg = "1207009916233981962"

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const embed = new EmbedBuilder()
        .setTitle("Candidate closure")
        .setDescription("This channel and following buttons are meant to be used once a department is full as an example and no longer accepting interns, so you click the button below so the Execurtive Interns are no longer able to chose the department as their desired department.")
        .setColor(0x00ffe5)
        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("hr")
            .setLabel("Toggle HRD")
            .setEmoji("👨‍💼")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("ops")
            .setLabel("Toggle Operations")
            .setEmoji("👥")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("comms")
            .setLabel("Toggle Communications")
            .setEmoji("🗣")
            .setStyle(ButtonStyle.Danger),
        )

//        client.channels.cache.get("1206677980990935061").send({embeds: [embed], components: [buttons]})
        const s = client.channels.cache.get("1206677980990935061").createMessageComponentCollector()

        const nowUTC = new Date()
        const estTime = nowUTC.toLocaleString("en-US", {timeZone: "America/New_York"})
        s.on("collect", async i => {
            if (i.customId == "hr") {
                var hrcan = await db.get("HRCan.disabled")
                await db.set("HRCan.disabled", !hrcan)
                if (hrcan) hrcan = "enabled"
                else if (!hrcan) hrcan = "disabled"
                await i.reply({content: `The HRD candidate button has now been ${hrcan} in <#1206773441534107738>`, ephemeral:true})
                await client.channels.cache.get("1206998357076353075").send(`The HRD candidate button has been ${hrcan} by <@${i.user.id}>. ${estTime}`)
            }
            else if (i.customId == "ops") {
                var opscan = await db.get("OpsCan.disabled")
                await db.set("OpsCan.disabled", !opscan)
                if (opscan) opscan = "enabled"
                else if (!opscan) opscan = "disabled"
                await i.reply({content: `The Operations candidate button has now been ${opscan} in <#1206773441534107738>`, ephemeral:true})
                await client.channels.cache.get("1206998357076353075").send(`The Operations candidate button has been ${opscan} by <@${i.user.id}>. ${estTime}`)
            }
            else if (i.customId == "comms") {
                var commscan = await db.get("CommsCan.disabled")
                await db.set("CommsCan.disabled", !commscan)
                if (commscan) commscan = "enabled"
                else if (!commscan) commscan = "disabled"
                await i.reply({content: `The Communications candidate button has now been ${commscan} in <#1206773441534107738>`, ephemeral:true})
                await client.channels.cache.get("1206998357076353075").send(`The Communications candidate button has been ${commscan} by <@${i.user.id}>. ${estTime}`)
            }
            const EIembed = new EmbedBuilder()
            .setTitle("Role Selection")
            .setDescription("Greetings Executive Intern's!\nYou must choose your department by clicking on the buttons on this message, you may either chose:\n\n**1 OF**\nHuman Resources Department\nOR\nOperations Department\n\n\nYou can also **optionally** choose one of the following ON TOP OF your choice:\nCommunications.")
            .setColor(0x00ffe5)
            const EIbuttons = new ActionRowBuilder()
            .addComponents(    
                new ButtonBuilder()
                .setCustomId("Human Resources")
                .setEmoji("👨‍💼")
                .setLabel("Human Resources Department")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(await db.get("HRCan.disabled")),
                new ButtonBuilder()
                .setCustomId("Operations")
                .setEmoji("👥")
                .setLabel("Operations Department")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(await db.get("OpsCan.disabled")),
                new ButtonBuilder()
                .setCustomId("Communications")
                .setEmoji("🗣")
                .setLabel("Communications")
                .setStyle(ButtonStyle.Success)
                .setDisabled(await db.get("CommsCan.disabled"))
            )
            await client.channels.cache.get(eiannchan).messages.fetch(departmentrolemsg).then(async mes => {
                mes.edit({embeds: [EIembed], components: [EIbuttons]})
            })
        })
    }
};