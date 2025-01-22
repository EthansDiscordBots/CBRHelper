import { deployListeners } from "./src/Functions/deployListeners";
const express = require("express");
const bodypass = require("body-parser")
const cook = require("cookie-parser")

const app = express();
const PORT = 5000; // Use any available port

app.use(bodypass.json())
app.use(cook())

deployListeners(app)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webhook listener running on port ${PORT}`);
});