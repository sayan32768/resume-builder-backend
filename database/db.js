import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/resume-builder`)
        console.log('MongoDB connected successfully!')
    } catch (e) {
        console.log(`MongoDB Connection Error, ${e}`)
    }
}

export default connectDB