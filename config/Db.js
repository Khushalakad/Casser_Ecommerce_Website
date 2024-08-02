import mongoose  from "mongoose";
import colors from "colors"
//connect from mongoose
const connectDB=async()=>{
try {
   const conn= await mongoose.connect(process.env.MONGO_URL)
   console.log(`MongoDB is Conneted ${conn.connection.host}`.bgMagenta.white);
} catch (error) {
    console.log(`Error in mongoDB connection ${error}`.bgRed.white);
}
}
export default connectDB;