import mongoose, {Schema,Document}from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date
}

// the interface above defines the type safety

const MessageSchema:Schema<Message> = new Schema({

    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}


const UserSchema:Schema<User> = new Schema({

    username:{
        type:String,
        required:[true,"Username is Required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        trim:true,
        unique:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },
    verifyCode:{
        type:String,
        required:[true,"VerifyCode is Required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"VerifyCodeExpiry is Required"],
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    messages:[MessageSchema]
})

//  (if model already exists return that ) || (create the model now)
const Usermodel = (mongoose.models.User as mongoose.Model<User>) || ( mongoose.model<User>("User",UserSchema))
export default Usermodel