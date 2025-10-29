import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from './routes/userRoute.js'
import resumeRoute from './routes/resumeRoute.js'
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const PORT = process.env.PORT || 3000

// Middleware for resolving json body
app.use(express.json())

app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/user', userRoute)
app.use('/resume', resumeRoute)

// Run the server
// app.listen(PORT, () => {
//     connectDB()
//     console.log(`Server is listening at PORT: ${PORT}`)
// })

export default app;