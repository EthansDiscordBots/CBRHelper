import { QuickDB } from "quick.db";
const db = new QuickDB();
module.exports = {
    method: 'get',
    directory: "/test",
    async execute(req, res, client) {
        res.stats(200).send("Testing")
    }
}
