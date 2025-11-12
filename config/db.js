import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const connectDB= async ()=>{
  try {
    const conn= await mongoose.connect(process.env.MONGO_URL);
      console.log("Database connected successfully!");
  } catch (error) {
     console.log("Error:",error);
  }
}

export default connectDB;