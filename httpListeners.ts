import { deployListeners } from "./src/Functions/deployListeners";
const express = require("express");
const bodypass = require("body-parser")

const app = express();
const PORT = 5000; // Use any available port

deployListeners(app)

app.use(bodypass.json())

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webhook listener running on port ${PORT}`);
});