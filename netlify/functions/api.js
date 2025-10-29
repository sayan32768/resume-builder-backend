import express from "express";
import 'dotenv/config';
// import connectDB from "../../database/db.js";
import userRoute from '../../routes/userRoute.js';
import resumeRoute from '../../routes/resumeRoute.js';
import cors from "cors";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

const app = express();

// connectDB();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/resume-builder`)
        console.log('MongoDB connected successfully!')
    } catch (e) {
        console.log(`MongoDB Connection Error, ${e}`)
    }
})()


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/user', userRoute);
app.use('/resume', resumeRoute);

export const handler = serverless(app);
