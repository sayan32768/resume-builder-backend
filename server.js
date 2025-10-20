import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from './routes/userRoute.js'

const app = express()

const PORT = process.env.PORT || 3000

// Middleware for resolving json body
app.use(express.json())

app.use('/user', userRoute)

// Run the server
app.listen(PORT, () => {
    connectDB()
    console.log(`Server is listening at PORT: ${PORT}`)
})
