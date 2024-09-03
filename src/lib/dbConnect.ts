import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void> {

    //if db connection already exists
    if(connection.isConnected){
        console.log("Already connected")
        return
    }

    //if doesnt exist
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI||'',{})

        // console.log(db)
        connection.isConnected = db.connections[0].readyState

        console.log("DB connnection Successfull")
    } catch (error) {

        console.log("DB connection failed",error)
        process.exit(1) //gracefully exit because conn failed
    }
}

export default dbConnect





//db connnection check is required because nextjs runs on edge time soif db is already connected and 
// we make extra requests we will be choking the app