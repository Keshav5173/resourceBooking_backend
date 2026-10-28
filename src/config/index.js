import mongoose from "mongoose";


const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Database connected successfully");
    }catch(err){
        console.log("Database connection failed");
        console.log(err);
    }
}

export { connectDb };