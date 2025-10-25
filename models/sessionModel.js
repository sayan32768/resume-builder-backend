import mongoose from "mongoose";

// Create the Schema for Session
const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Session = mongoose.model("Session", sessionSchema)