import { EmbedBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import { getIdFromUsername } from "../Functions/getIdFromUsername";
const db = new QuickDB();
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            const initialfetch = await fetch("https://groups.roblox.com/v1/groups/4720080/audit-log?limit=100&sortOrder=Desc", {
                headers: {
                    "Cookie": ".ROBLOSECURITY=" + String(process.env.cookie)
                }
            });
            const audit = await initialfetch.json();
            
            const lastAuditTimestamp = await db.get("LastAuditLog") || 0;

            for (let i = 0; i < audit.data.length; i++) {
                const current_check = audit.data[i];
                const entryTimestamp = Math.floor(new Date(current_check.created).getTime() / 1000);

                if (entryTimestamp > lastAuditTimestamp) {
                    if (current_check.actionType == "Change Rank") {
                        await db.unshift("Tolog", {
                            MainData: `**Change Rank:**
                                       **Target:** ${current_check.description.TargetName} (${current_check.description.TargetId})
                                       **Old Rank:** ${current_check.description.OldRoleSetName}
                                       **New Rank:** ${current_check.description.NewRoleSetName}`,
                            Actor: current_check.actor.user.username,
                            Target: current_check.description.TargetName,
                            date: current_check.created
                        });
                    } 
                    else if (current_check.actionType == "Post Status") {
                        await db.unshift("Tolog", {
                            MainData: `**Post Group Shout:**
                                       **Text:** ${current_check.description.Text}`,
                            Actor: current_check.actor.user.username,
                            date: current_check.created
                        });
                    } 
                    else if (current_check.actionType == "Update Group Asset") {
                        await db.unshift("Tolog", {
                            MainData: `**Update Group Asset:**
                                       **Asset:** ${current_check.description.AssetName} (${current_check.description.AssetId})
                                       **Version:** ${current_check.description.VersionNumber}`,
                            Actor: current_check.actor.user.username,
                            date: current_check.created
                        });
                    }
                    else if (current_check.actionType == "Spend Group Funds") {
                        await db.unshift("Tolog", {
                            MainData: `**Spend Group Funds:**
                                        **Total:** ${current_check.description.Amount}
                                        **Users:** ${current_check.description.ItemDescription.split("funds to")[1]}`,
                            Actor: current_check.actor.user.username,
                            date: current_check.created
                        })
                    }
                    else if (current_check.actionType == "Delete Post") {
                        await db.unshift("Tolog", {
                            MainData: `**Delete Post:**
                                        **Posted by:** ${current_check.description.TargetName} (${current_check.description.TargetId})
                                        **Post text:** ${current_check.description.PostDesc}`,
                            Actor: current_check.actor.user.username,
                            Target: current_check.description.TargetName,
                            date: current_check.created
                        })
                    }
                }
                
            }

            // Update the timestamp of the last audit log entry in the database
            if (audit.data.length > 0) {
                const date_last_audit = Math.floor(new Date(audit.data[0].created).getTime() / 1000);
                await db.set("LastAuditLog", date_last_audit);
            }
            await new Promise(r => setTimeout(r, 1000))
            const embeds = [];
            for (let i = 0; i < 10 && i < (await db.get("Tolog")).length; i++) {
                const data = await db.shift("Tolog")
                try {
                    const actoricon = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${await getIdFromUsername(data.Actor)}&size=420x420&format=Png&isCircular=false`).then(async res => await res.json()) 
                    const targetava = data.Target ? await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${await getIdFromUsername(data.Target)}&size=720x720&format=Png&isCircular=false`).then(async res => await res.json()) : ""
                    const embed = new EmbedBuilder()
                        .setDescription(data.MainData)
                        .setAuthor({name: data.Actor, iconURL: actoricon.data[0].imageUrl})
                        .setColor(0x00ffe5)
                        .setTimestamp(new Date(data.date))
                    if (data.Target) try {embed.setThumbnail(targetava.data[0].imageUrl)} catch {}
                    embeds.push(embed);
                } catch (err) {
                    console.error(err)
                    await db.unshift("Tolog", data)
                }
            }

            if (embeds.length > 0) {
                await client.channels.cache.get("1279312212032491520").send({ embeds });
            }

        }, 7500);
    }
};
