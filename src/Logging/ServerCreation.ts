import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Embed, time, embedLength } from "discord.js";
import { Client, Collection, Entry, EntryData } from "marcsync";
interface Logging extends EntryData {
    "Host Name": string,
    PlrCount: string,
    TpsCode: string,
    ServerNum: number,
    SlockOn: boolean,
    type: string
}
const ms = new Client(String(process.env.mskey))
const TrainingCentreLogs: Collection<Logging> = ms.getCollection("Training logs")
import { retryOperation } from "../Functions/retry";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(async () => {
            var traininglogspending
            const traininglogsembeds = []
            async function getentries() {
                return await TrainingCentreLogs.getEntries({ type: "ServerCreation" })
            }
            retryOperation(getentries)
                .then(res => traininglogspending = (res || []))

            await new Promise(r => setTimeout(r, 3000))
            if (traininglogspending?.length > 0) {
                for (let i = 0; i < 10 && i < traininglogspending.length; i++) {
                    const data: Entry<Logging> = traininglogspending[i]
                    const emmm = new EmbedBuilder()
                    emmm.setTitle("New server created!")
                    emmm.addFields(
                        { name: "User:", value: data.getValue("Host Name"), inline: true },
                        { name: "Server:", value: String(data.getValue("ServerNum")), inline: true }
                    )

                    emmm.setColor(0x00ffe5)
                    traininglogsembeds.push(emmm)
                    var eventId
                    const myHeaders = new Headers();
                    const date = new Date()
                    date.setHours(new Date().getUTCHours() + 1, 0, 0, 0)
                    const vate = new Date()
                    vate.setHours(new Date().getUTCHours(), 0, 0, 0)
                    myHeaders.append("Authorization", "Bearer 1f901bc6f6c3268019c128a7c27b4ddd2d50b1036b7c5fe2a2f7a2d6a36ea3df");
                    //
                    fetch(`https://api.hyra.io/activity/sessions/64de404af9ac141c9c481c39?day=${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, { method: "GET", headers: myHeaders }).then(async res => {
                        const data = await res.json()
                        const trainingSession = data.events.find(item => new Date(item.start).toISOString() === date.toISOString() || new Date(item.start).toISOString() === vate.toISOString());
                        // If the training session is found, retrieve its _id
                        if (trainingSession) {
                            console.log(trainingSession)
                            const id = trainingSession._id;
                            eventId = id
                        } else {//
                            console.log('Training session not found');
                        }
                    })
                    await new Promise(r => setTimeout(r, 1000))
                    fetch(`https://api.hyra.io/activity/sessions/64de404af9ac141c9c481c39/${eventId}/server`, {
                        method: "POST",
                        headers: myHeaders,
                        redirect: "follow"
                    }).then(async (response) => {
                        const data2 = await response.json()
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
                        async function someOperation() {
                            async function createTraining() {
                                ms.getCollection("Trainings").createEntry({
                                    "Host Name": data.getValue("Host Name"),
                                    PlrCount: "1",
                                    TpsCode: data.getValue("TpsCode"),
                                    ServerNum: data.getValue("ServerNum"),
                                    SlockOn: true,
                                    HyraServerId: data2._id,
                                    HyraEventId: eventId
                                })
                            }

                            retryOperation(createTraining)
                        }
                        retryOperation(someOperation)
                            .then(result => console.log("Operation succeeded"))
                            .catch(error => console.error("Operation failed:", error.message));
                    })
                    TrainingCentreLogs.deleteEntryById(data.getValue("_id"))
                }

                client.channels.cache.get("1209982303913381910").send({ embeds: traininglogsembeds })
            }
        }, 10000);
    }
}