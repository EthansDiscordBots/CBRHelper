import { EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder } from "discord.js";
export async function EIEmbed(client, channelId) {
    const embed = new EmbedBuilder()
                .setDescription(`
                **## <:Clipboard:1282064645745803325> Department Information**
** 🔎 Discover Your Opportunities at Crystal Bay Resorts!**

Dear Executive Interns,

We're excited to introduce you to the key departments at Crystal Bay Resorts, where you'll start your certification program. Each department plays a vital role in our resort’s success. Here’s a brief overview:

**1. <:StaffIcon:1282062858225455266> Human Resources Department:**
The HRD focuses on maintaining a positive work environment. They address staff inquiries, handle reports, and manage appeals to ensure fairness for all employees.

**2. 🎓 Operations Department:**
The Operations team ensures smooth resort functioning by managing the Training Centre and evaluating its effectiveness.

**3. <:TicketIcon:1282063702807412766> Communications Department:**
This department enhances our public image, organizes events, and runs the Quote of the Day (QOTD) initiative to engage with guests and the community.
                `)
                .setColor(0x00ffe5)
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("DepartmentSelect")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Select Department")
            )
    await client.channels.cache.get(channelId).send({embeds: [embed], components: [row]})
}