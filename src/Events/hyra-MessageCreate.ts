import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Events, GuildScheduledEventManager } from "discord.js";
const date = new Date()
import { Client } from "marcsync"
import { getIdFromUsername } from "noblox.js";
const ms = new Client(String(process.env.mskey))
const print = console.log
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.on(Events.MessageCreate, async message => {
            async function retryOperation(operation, maxRetries = 3, delay = 1000) {
                for (let retry = 0; retry < maxRetries; retry++) {
                    try {
                        return await operation();
                    } catch (error) {
                        console.error(`Attempt ${retry + 1} failed:`, error);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
                throw new Error(`Operation failed after ${maxRetries} retries`);
            }
            
            const c = ms.getCollection("Trainings")
            try {
                if (message.channel.id == "1210390277848694784") {
                    const server = message.content.split(" ")[1]

                    const d = await c.getEntryById("661716d7b005baa1fa9deac7")
                    async function aaaaaaa() {
                        c.updateEntryById("661716d7b005baa1fa9deac7", { ServersOpened: Number(d.getValue("ServersOpened") != 0 ? d.getValue("ServersOpened") : 1) - 1})
                        c.deleteEntries({ServerNum: Number(server)})
                    }

                    retryOperation(aaaaaaa)
                    .then(result => console.log("Operation succeeded -  update servers opened"))
                    .catch(error => console.error("Operation failed:", error.message));
                    setTimeout(() => {

                        // Example usage:
                        async function someOperation() {
                            c.deleteEntries({ ServerNum: 0 }).catch(err => { })
                        }

                        retryOperation(someOperation)
                            .then(result => console.log("Operation succeeded - delete servers with server num as 0"))
                            .catch(error => console.error("Operation failed:", error.message));

                    }, 30000);

                }
                else if (message.channel.id == "1209982322737283092") {
                    const data = [
                        {
                            A: {
                                _id: "65ce8e718d8c2ac79e2e826b",
                                roles: {
                                    Trainer: "65ce8e768d8c2ac79e2e8279",
                                    A1: "65ce8e7e8d8c2ac79e2e8290",
                                    A2: "65ce8e818d8c2ac79e2e8294",
                                    A3: "65ce8e848d8c2ac79e2e829a"
                                }
                            },
                            B: {
                                _id: "65ce8e8b8d8c2ac79e2e82bd",
                                roles: {
                                    Trainer: "65ce8e8d8d8c2ac79e2e82cb",
                                    A1: "65ce8e918d8c2ac79e2e82d8",
                                    A2: "65ce8e928d8c2ac79e2e82e3",
                                    A3: "65ce8e948d8c2ac79e2e82e9"
                                }
                            }
                        },
                        {
                            
                            A: {
                                _id: "65ce8eea8d8c2ac79e2e83de",
                                roles: {
                                    Trainer: "65ce8eed8d8c2ac79e2e83e0",
                                    A1: "65ce8ef38d8c2ac79e2e8408",
                                    A2: "65ce8ef48d8c2ac79e2e840c",
                                    A3: "65ce8ef58d8c2ac79e2e8411"
                                }
                            },
                            B: {
                                _id: "65ce8efd8d8c2ac79e2e8456",
                                roles: {
                                    Trainer: "65ce8f008d8c2ac79e2e845c",
                                    A1: "65ce8f018d8c2ac79e2e845f",
                                    A2: "65ce8f028d8c2ac79e2e8463",
                                    A3: "65ce8f038d8c2ac79e2e8468"
                                }
                            }
                        },
                        {
                            
                            A: {
                                _id: "65ce8f538d8c2ac79e2e84f2",
                                roles: {
                                    Trainer: "65ce8f568d8c2ac79e2e84fb",
                                    A1: "65ce8f578d8c2ac79e2e84fe",
                                    A2: "65ce8f588d8c2ac79e2e8505",
                                    A3: "65ce8f5a8d8c2ac79e2e850f"
                                }
                            },
                            B: {
                                _id: "65ce8f5f8d8c2ac79e2e8520",
                                roles: {
                                    Trainer: "65ce8f658d8c2ac79e2e8528",
                                    A1: "65ce8f668d8c2ac79e2e852c",
                                    A2: "65ce8f678d8c2ac79e2e8533",
                                    A3: "65ce8f698d8c2ac79e2e8539"
                                }
                            }
                        },
                        {
                            _id: "65ce901c8d8c2ac79e2e8717",
                            spec1: "65ce90228d8c2ac79e2e8729",
                            spec2: "65ce90248d8c2ac79e2e8732",
                            spec3: "65ce90268d8c2ac79e2e873b",
                            lead1: "65ce905c8d8c2ac79e2e87b1",
                            lead2: "65ce905e8d8c2ac79e2e87b9",
                            lead3: "65ce905f8d8c2ac79e2e87c1"
                        }
                    ]
                    const astsplit = message.content.split("**")
                    const target = String(await getIdFromUsername(astsplit[1]))
                    var role = astsplit[3].split(" ")[2] ?? "N/A"
                    const group = astsplit[3].split(" ")[0] ?? "N/A"
                    const letter = astsplit[3].split(" ")[1] ?? "N/A"
                    const server: Number = astsplit[7]
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", "Bearer 1f901bc6f6c3268019c128a7c27b4ddd2d50b1036b7c5fe2a2f7a2d6a36ea3df");
                    var eventId
                    var serverId
                    if (astsplit[3].split(" ")[2] == "Assistant") role = "A"+astsplit[3].split(" ")[3]
                    c.getEntries().then(async entry => {
                        for (let i = 0; i < entry.length; i++) {
                            const tr = entry[i]
                            if (tr.getValue("ServerNum") == server) {
                                serverId = tr.getValue("HyraServerId")
                                eventId = tr.getValue("HyraEventId")
                            }
                        }
                    })
                    await new Promise(r => setTimeout(r, 1000))
                    if (server == 1 && group == "Host" || group == "Co-host") {

                        const raw = JSON.stringify({
                            "prop": String(group.replace(/-/g, "")).toLowerCase(),
                            "value": target
                        });

                        fetch(`https://api.hyra.io/activity/sessions/64de404af9ac141c9c481c39/${eventId}/change`, {
                            method: "PATCH", headers: myHeaders, body: raw, redirect: "follow"
                        }).then(async r => {
                            const d = await r.text()
                            console.log(d)
                        })
                    }
                    else if (server != 1 && group == "Host" || group == "Co-host") {
                        const raw = JSON.stringify({
                            "prop": String(group.replace(/-/g, "")).toLowerCase(),
                            "value": target,
                            "server_id": serverId
                        });

                        fetch(`https://api.hyra.io/activity/sessions/64de404af9ac141c9c481c39/${eventId}/change`, {
                            method: "PATCH", headers: myHeaders, body: raw, redirect: "follow"
                        }).then(async r => {
                            const d = await r.text()
                            console.log(d)
                        })
                    }
                    else {
                        const groups = ["Receptionist", "Security", "Housekeeping"]
                        const datas = data[groups.indexOf(group)]
                        if (role == "Spectator") return
                        const raw = JSON.stringify({
                            group_id: datas[letter]._id,
                            prop: "role",
                            role_id: datas[letter].roles[role],
                            server_id: serverId,
                            value: target
                        });
                        console.log(raw)
                        fetch(`https://api.hyra.io/activity/sessions/64de404af9ac141c9c481c39/${eventId}/change`, {
                            method: "PATCH", headers: myHeaders, body: raw, redirect: "follow"
                        }).then(async r => {
                            const d = await r.text()
                            console.log(d)
                        })
                    }

                }

            } catch (err) {
                (await client.guilds.cache.get(process.env.MainServerId).members.fetch("849729544906997850")).send("The bot died in hyra msg create | " + String(err))
                console.log(err)
            }
        })
    }
}