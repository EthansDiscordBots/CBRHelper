import { deployListeners } from "./src/Functions/deployListeners";
const express = require("express");
const bodypass = require("body-parser")
const cook = require("cookie-parser")
import * as path from "path"
require('dotenv').config();
const app = express();
const PORT = 5000; // Use any available port

app.use(bodypass.json())
app.use(cook())
app.use((req, res, next) => {
    const folderPath = path.join("Website", req.path)
    if (folderPath) {
        res.sendFile(path.resolve(path.join(folderPath, "index.html")), err => {
            if (err) console.log(err)
            if (err) next()
        })
    } else {
        next()
    }
})


deployListeners(app)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webhook listener running on port ${PORT}`);
});