require("dotenv").config();

const app = require("./app");
const connectMongoDB = require("./config/mongodb");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectMongoDB();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();