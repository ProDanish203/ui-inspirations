import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGO_URI) return console.log("Database url not found");
    if (isConnected) return console.log("Already Connected To Database");

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Connected To Database");
    } catch (error) {
        console.log(error);
    }
};
