import { QuickDB } from "quick.db";
const db = new QuickDB()

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        let friendslist = await db.get("friendslist") || []
        setInterval(() => {
            fetch(`https://friends.roblox.com/v1/users/865821656/friends`).then(async res => {
                const data = await res.json()
                const userIds = data.data.map(m => m.id)
                for (let i = 0; i < friendslist.length; i++) {
                    if (userIds.includes(friendslist[i])) continue
                    const inforaw = await fetch(`https://users.roblox.com/v1/users/${friendslist[i]}`)
                    const info = await inforaw.json()
                    client.channels.cache.get("1196090070298538098").send(`<@849729544906997850> User ${info.name} has been unfriended.`)
                    friendslist.splice(friendslist.indexOf(friendslist[i]))
                }
                for (let i =0; i < data.data.length; i++) {
                    if (friendslist.includes(data.data[i].id)) continue
                    friendslist.unshift(data.data[i].id)
                }

                await db.set("friendslist", friendslist)
            })
        }, 60000);
    }
}