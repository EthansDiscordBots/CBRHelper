import { QuickDB } from "quick.db";
const db = new QuickDB();
module.exports = {
    method: 'get',
    directory: "/test",
    async execute(req, res, client) {
        res.status(200).send("Testing")
    },
    async run(client) {
        console.log("discordjs client ready")
    }
}
