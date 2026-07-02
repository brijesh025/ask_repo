console.log("Using main.js");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./db/connectDB");

const PORT = process.env.PORT || 8000;

//--------------connection with DB------------
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
