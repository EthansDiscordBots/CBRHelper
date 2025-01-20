import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'get',
    directory: "/test",
    async execute(req, res, client) {
        res.send(`<html><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="icon" type="image/png" href="https://cdn.discordapp.com/icons/480452557949370380/403c3e417e9428040274db6b98b5d618.png?size=16"/><title>closed│danny2o8</title><script>document.addEventListener("click",t=>{let e=t.target;if(!e)return;let o=e?.getAttribute("data-goto");if(o){let r=document.getElementById(\`m-${o}\`);r?(r.scrollIntoView({behavior:"smooth",block:"center"}),r.style.backgroundColor="rgba(148, 156, 247, 0.1)",r.style.transition="background-color 0.5s ease",setTimeout(()=>{r.style.backgroundColor="transparent"},1e3)):console.warn("Message ${goto} not found.")}});</script><script>window.$discordMessage={profiles:{"1138830931914932354":{"author":"[/] Helper Bot","avatar":"https://cdn.discordapp.com/avatars/1138830931914932354/5b7b105d7920c9af8546b4b28635c82c.webp?size=64","roleColor":"#000000","bot":true,"verified":false},"1222436636156231711":{"author":"Danny","avatar":"https://cdn.discordapp.com/avatars/1222436636156231711/32d89e37bb806c64728ca4c2f52c50b3.webp?size=64","bot":false,"verified":false},"1325526501365514270":{"author":"Daniel","avatar":"https://cdn.discordapp.com/avatars/1325526501365514270/51e8a325d14e46ee3c6304c8c0b935c6.webp?size=64","bot":false,"verified":false}}}</script><script type="module" src="https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@^3.6.1/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js"></script></head><body style="margin:0;min-height:100vh"><discord-messages style="min-height:100vh"><discord-header guild="Crystal Bay Resorts™" channel="closed│danny2o8" icon="https://cdn.discordapp.com/icons/480452557949370380/403c3e417e9428040274db6b98b5d618.webp?size=128">This is the start of #closed│danny2o8 channel.</discord-header><discord-message id="m-1329846449252470809" timestamp="2025-01-17T16:15:00.854Z" edited="false" highlight="false" profile="1138830931914932354"><discord-embed embed-title="A new ticket has been made!" slot="embeds" color="#00ffe5"><discord-embed-description slot="description">Thank you for contacting support.<br/>Please describe your issue and await a response.</discord-embed-description></discord-embed><discord-embed slot="embeds" color="#00ffe5"><discord-embed-fields slot="fields"><discord-embed-field field-title="Open Reason" inline="false" inline-index="1">Resigning</discord-embed-field></discord-embed-fields></discord-embed><discord-attachments slot="components"><discord-action-row><discord-button type="success" emoji="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f4cb.svg">Claim</discord-button><discord-button type="destructive" emoji="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f512.svg">Close</discord-button></discord-action-row></discord-attachments></discord-message><discord-message id="m-1329846474389065921" timestamp="2025-01-17T16:15:06.847Z" edited="false" highlight="false" profile="1222436636156231711">Hello.</discord-message><discord-message id="m-1329847327644713000" timestamp="2025-01-17T16:18:30.279Z" edited="false" highlight="false" profile="1222436636156231711">As said. I would like to resign from my position as AM. This is due to me not being able to complete the quota.</discord-message><discord-message id="m-1329847534528495656" timestamp="2025-01-17T16:19:19.604Z" edited="false" highlight="false" profile="1222436636156231711">I didn’t know if this was the place to do so. However. Yeah.</discord-message><discord-message id="m-1329852641550794947" timestamp="2025-01-17T16:39:37.213Z" edited="false" server="false" highlight="false" profile="1138830931914932354"><discord-reply slot="reply" edited="false" attachment="false" author="[/] Helper Bot" avatar="https://cdn.discordapp.com/avatars/1138830931914932354/5b7b105d7920c9af8546b4b28635c82c.webp?size=32" role-color="#000000" bot="true" verified="false" op="false" command="false"><em data-goto="1329846449252470809">Click to see attachment.</em></discord-reply><discord-embed slot="embeds" color="#00ffe5"><discord-embed-description slot="description">This ticket has been claimed by <discord-mention type="user">Daniel</discord-mention></discord-embed-description></discord-embed></discord-message><discord-message id="m-1329852738791804948" timestamp="2025-01-17T16:40:00.397Z" edited="false" highlight="false" profile="1325526501365514270">## <discord-custom-emoji name="🎟️" url="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f39f.svg" embed-emoji="false"></discord-custom-emoji> CBR SUPPORT — Human Resources<br/><br/>Greetings, <discord-mention type="user">Danny</discord-mention> ! My name is Allopop2468, a Executive Assistant in the <discord-underlined>Human Resources Department</discord-underlined>. I will be assisting with your inquiry today.</discord-message><discord-message id="m-1329852885122682951" timestamp="2025-01-17T16:40:35.285Z" edited="false" highlight="false" profile="1222436636156231711">Hello.</discord-message><discord-message id="m-1329852902902206546" timestamp="2025-01-17T16:40:39.524Z" edited="true" highlight="false" profile="1325526501365514270">## RESIGNATION PROCESS <br/><br/>We understand there come times when unfortunate circumstances hold you back within our team. Whether it is personal or not, we will always be here to support you. Before processing your resignation, we highly encourage taking a leave of absence (up to 14 days) before considering a resignation. Understand that you may only take a leave of absence if you have not reached the maximum number of absences for this month. Should this be the case, please inform us within this ticket.<br/><br/>If you still wish to resign, please complete the following format below. Once this message has been sent, allow at least 3-5 minutes for the resignation to be processed. I will reply once it is complete.<br/><br/>Resignation Notice<br/><discord-bold>USERNAME</discord-bold>: <br/><discord-bold>DATE</discord-bold>:<br/><discord-bold>RANK</discord-bold>:<br/><discord-bold>REASON</discord-bold>:<br/><br/><discord-custom-emoji name="❕" url="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2755.svg" embed-emoji="false"></discord-custom-emoji> Please ensure that you are certain you wish to resign before sending the format within this ticket as this decision cannot be reversed. You may only reclaim your rank if it was purchased.</discord-message><discord-message id="m-1329853146800848969" timestamp="2025-01-17T16:41:37.674Z" edited="false" highlight="false" profile="1222436636156231711">Alright. I will consider a loa. However, I failed my quota last week.</discord-message><discord-message id="m-1329853593829769370" timestamp="2025-01-17T16:43:24.254Z" edited="false" server="false" highlight="false" profile="1325526501365514270"><discord-reply slot="reply" edited="false" attachment="false" author="Danny" avatar="https://cdn.discordapp.com/avatars/1222436636156231711/32d89e37bb806c64728ca4c2f52c50b3.webp?size=32" bot="false" verified="false" op="false" command="false"><span data-goto="1329853146800848969">Alright. I will consider a loa. However, I failed my quota last week.</span></discord-reply>Quota will be handled every Sunday at 11:59 PM EST so you still have time to complete it. If you have considered to take LOA (Leave of absence) then please send a request on hyra.</discord-message><discord-message id="m-1329854472758890547" timestamp="2025-01-17T16:46:53.807Z" edited="false" highlight="false" profile="1325526501365514270">Is there anything else I can assist you with in this ticket today <discord-mention type="user">Danny</discord-mention> ?</discord-message><discord-message id="m-1329855085429133322" timestamp="2025-01-17T16:49:19.879Z" edited="false" server="false" highlight="false" profile="1222436636156231711"><discord-reply slot="reply" edited="false" attachment="false" author="Daniel" avatar="https://cdn.discordapp.com/avatars/1325526501365514270/51e8a325d14e46ee3c6304c8c0b935c6.webp?size=32" bot="false" verified="false" op="false" command="false"><span data-goto="1329854472758890547">Is there anything else I can assist you with in this ticket today <discord-mention type="user">Danny</discord-mention> ?</span></discord-reply>No you’re all good. Thanks.</discord-message><discord-message id="m-1329880727864606770" timestamp="2025-01-17T18:31:13.512Z" edited="false" server="false" highlight="false" profile="1138830931914932354"><discord-reply slot="reply" edited="false" attachment="false" author="[/] Helper Bot" avatar="https://cdn.discordapp.com/avatars/1138830931914932354/5b7b105d7920c9af8546b4b28635c82c.webp?size=32" role-color="#000000" bot="true" verified="false" op="false" command="false"><em data-goto="1329846449252470809">Click to see attachment.</em></discord-reply><discord-embed embed-title="Ticket closed" slot="embeds" color="#00ffe5"><discord-embed-description slot="description">This ticket has been closed, would you like to delete the channel?</discord-embed-description></discord-embed><discord-attachments slot="components"><discord-action-row><discord-button type="destructive" emoji="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f5d1.svg">Delete</discord-button></discord-action-row></discord-attachments></discord-message><discord-message id="m-1329880757912731670" timestamp="2025-01-17T18:31:20.676Z" edited="false" server="false" highlight="false" profile="1138830931914932354"><discord-reply slot="reply" edited="false" attachment="false" author="[/] Helper Bot" avatar="https://cdn.discordapp.com/avatars/1138830931914932354/5b7b105d7920c9af8546b4b28635c82c.webp?size=32" role-color="#000000" bot="true" verified="false" op="false" server="false" command="false"><em data-goto="1329880727864606770">Click to see attachment.</em></discord-reply>Deleting channel...</discord-message><div style="text-align:center;width:100%">Exported 14 messages. <span style="text-align:center">Powered by <a href="https://github.com/ItzDerock/discord-html-transcripts" style="color:lightblue">discord-html-transcripts</a>.</span></div></discord-messages></body></html>`)
    },
    async run(client) {
    }
}
