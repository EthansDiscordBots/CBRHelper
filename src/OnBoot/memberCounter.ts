import * as cron from "node-cron"
import {QuickDB} from "quick.db"
const db = new QuickDB
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        cron.schedule("*/20 * * * * *", () => {
            fetch(`https://groups.roblox.com/v1/groups/${Number(process.env.groupId)}`).then(
                async response => {
                    var data = await response.json()
                    const goal = await db.get("membergoal")
                    if (await db.get("MemberCount") < data.memberCount) {
                        client.channels.cache.get(process.env.MemberCount).send(`The roblox group currently has ${data.memberCount} members! We are ${goal - data.memberCount} members away from ${goal}!`)
                        await db.set("MemberCount", data.memberCount)
                    }
                    else if (await db.get("MemberCount") > data.memberCount) {
                        client.channels.cache.get(process.env.MemberCount).send(`Oh no! We lost a member! The roblox group now has ${data.memberCount} members! We are ${goal - data.memberCount} members away from ${goal}!`)
                        await db.set("MemberCount", data.memberCount)
                    }
                }
            )
        })
    }
};