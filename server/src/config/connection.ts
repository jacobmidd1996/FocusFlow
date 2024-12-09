
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || "need to update .env");

const db = mongoose.connection;

export default db;
