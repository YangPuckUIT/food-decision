const mongoose = require("mongoose");

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { ...(process.env.MONGO_DB_NAME ? { dbName: process.env.MONGO_DB_NAME } : {}), serverSelectionTimeoutMS: 10000 });

        console.log("MongoDB connected");
        console.log("Database:", mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection failed. Check MONGO_URI, database credentials and Atlas network access.");
        process.exit(1);
    }
};

module.exports = connectMongoDB;