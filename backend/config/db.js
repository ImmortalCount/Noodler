import mongoose from 'mongoose'

const connectDB = async () => {
    try { 
    const conn = await mongoose.connect(process.env.NOODLER_DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    console.log(`MONGODB connected ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB