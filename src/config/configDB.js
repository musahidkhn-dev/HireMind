import mongoose from "mongoose";
import colors from "colors"
const connectDB = async () => {
    try {
    const conn = await mongoose .connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`.bgGreen.white)

    } catch (error) {
        console.log(`DB CONNECTION FAILED : ${error.message}`.bgRed.white)
        process.exit(1);
    }
}

export default connectDB