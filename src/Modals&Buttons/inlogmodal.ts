import { TextInputStyle, ModalBuilder, TextInputBuilder, ChannelType, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, InteractionType, ComponentType, Events, Role, Options, Interaction, time } from "discord.js";
const date = new Date()
import { getPlayerThumbnail } from "noblox.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()
import { getIdFromUsername, getUsernameFromId } from "../Functions/getIdFromUsername";
import { getRoleInGroup } from "../Functions/getRoleInGroup";

const departmentAbbreviations = {
    HR: "Human Resources Department",
    Ops: "Operations Department Leadership",
    Comms: "Communications Department Leadership",
    OT: "Ownership Team"
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client: Client) {
        if (interaction.isModalSubmit() && interaction.customId == "InLog") {
            const approver_roblox = await getIdFromUsername(interaction.fields.getTextInputValue("Approver"))
            const requestRoblox = await getIdFromUsername(interaction.fields.getTextInputValue("Username"))
            let format = `## :alarm_clock: **INACTIVITY COMMENCEMENT**
            Dear **USERNAME**,
            
            This letter serves as official notice from the Human Resources Department at Crystal Bay Resorts. We are pleased to inform you that your recent request for inactivity has been reviewed and accepted. As a result, your inactivity period will be from **START-DATE** to **END-DATE**, during which you will be excused from all upcoming requirements.
            
            Should you have any inquiries or need assistance during your inactivity period, please do not hesitate to contact me or another Human Resources Department member. Our commitment is to create a supportive and productive work environment for all of our management members.
            
            We understand that life can be unpredictable, and taking time off may be necessary. We appreciate your understanding and cooperation in this matter, and we wish you all the best during your inactivity period. Additionally, if you wish to extend, shorten, or modify the reasoning behind your inactivity request, please direct message me, and I will promptly address your request.
            
            Signed,
            *APPROVERUSERNAME*,
            **RANK**
            **DEPARTMENT, Crystal Bay Resorts**`
            if (!await db.get(`${approver_roblox}.discord`)) return await interaction.reply({ ephemeral: true, content: "It seems the approver user is not verified on the helper bot. Please have them verify so the bot can determine the department the approver is. Logging process aborted." })
            if (!await db.get(`${requestRoblox}.discord`)) return await interaction.reply({ ephemeral: true, content: "It seems the requester isnt verified on the helper bot. Please ask them to verify so that the bot can DM them. Logging process aborted." })
            let splitDate = interaction.fileds.getTextInputValue("StartDate").split("-")
            let startdate = new Date()
            startdate.setDate(Number(splitDate[0]))
            startdate.setMonth(Number(splitDate[1]) + 1)
            startdate.setFullYear(Number(splitDate[2]))
            splitDate = interaction.fields.getTextInputValue("EndDate").split("-")
            let enddate = new Date()
            enddate.setDate(Number(splitDate[0]))
            enddate.setMonth(Number(splitDate[1]) + 1)
            enddate.setFullYear(Number(splitDate[2]))
            let department
            const reqdiscordobj = await client.guilds.cache.get(process.env.MainServerId as string)?.members.fetch(await db.get(`${approver_roblox}.discord`) as string)
            if (!reqdiscordobj) return await interaction.reply({ content: "There was an error fetching the approvers discord roles. Please try again later." })
            if (reqdiscordobj.roles.cache.get(process.env.MAINHR as string)) department = "HR"
            if (reqdiscordobj.roles.cache.get(process.env.MainServerCOO as string)) department = "Ops"
            if (reqdiscordobj.roles.cache.get(process.env.MainServerCCO as string)) department = "Comms"
            if (reqdiscordobj.roles.cache.get(process.env.President as string) || reqdiscordobj.roles.cache.get(process.env.VicePresident as string) || reqdiscordobj.roles.cache.get(process.env.CEO as string) || reqdiscordobj.roles.cache.get(process.env.AB as string)) department = "OT"
            if (!department) return await interaction.reply({ ephemeral: true, content: "None of your approvers roles correlate to a set up department, please contact Scr1ptxd_Ethxn if you believe this should be wrong." })

            format.replace("USERNAME", interaction.fields.getTextInputValue("Username"))
                .replace("APPROVERUSERNAME", interaction.fields.getTextInputValue("Approver"))
                .replace("RANK", (await getRoleInGroup(process.env.groupId, approver_roblox)).RankName)
                .replace("DEPARTMENT", departmentAbbreviations[department])
                .replace("START-DATE", interaction.fields.getTextInputValue("StartDate"))
                .replace("END-DATE", interaction.fields.getTextInputValue("EndDate"))

            const memberObject = await client.guilds.cache.get(process.env.MainServerId as string)?.members.fetch(await db.get(`${requestRoblox}.discord`) as string)
            if (!memberObject) return await interaction.reply({ content: "There was an error fetching the requesters discord account to DM. Please try again later." })

            const timeConfirm = new EmbedBuilder()
                .setDescription(`To confirm, are you sure you want to set the start date as ${startdate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} and the end date as ${enddate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`TimeAgree-${interaction.id}`)
                        .setLabel("Confirm")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`TimeDeny-${interaction.id}`)
                        .setLabel("Deny")
                        .setStyle(ButtonStyle.Danger)
                )

            await interaction.reply({ embeds: [timeConfirm], components: [buttons], ephemeral: true })

            await db.set(interaction.id, new EmbedBuilder()
                .setTitle("Approved Inactivity Notice.")
                .setColor("Green")
                .setFields(
                    {
                        name: "Username",
                        value: interaction.fields.getTextInputValue("Username")
                    },
                    {
                        name: "Approved by",
                        value: interaction.fields.getTextInputValue("Approver")
                    },
                    {
                        name: "Start date",
                        value: interaction.fields.getTextInputValue("StartDate")
                    },
                    {
                        name: "End date",
                        value: interaction.fields.getTextInputValue("EndDate")
                    },
                )
            )
        }

        if (interaction.isButton() && interaction.customId.split("-")[0] in ["TimeAgree", "TimeDeny"]) {
            if (interaction.customId.split("-")[0] == "TimeAgree") await interaction.channel.send({embeds: [await db.get(interaction.customId.split("-")[1])]})
            await db.delete(interaction.customId.split("-")[1])
            if (interaction.customId.split("-")[0] == "TimeDeny") await interaction.channel.send({content: "Please start again. Remember date is in the format DD-MM-YYYY", ephemeral: true})
        }
    }
}