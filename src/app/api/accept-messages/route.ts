import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Usermodel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth"
import Error from "next/error";


export async function POST(request:Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {
                status:401
            }
        )
    }

    const userId = user._id;

    const {acceptMessages} = await request.json()

    try {

        const updatedUser = await Usermodel.findByIdAndUpdate(
            userId,{
                isAcceptingMessage:acceptMessages
            },
            {
                new:true
            }
        )

        if(!updatedUser){

            return Response.json(
                {
                    success:false,
                    message:"FAILED TO UPDATE USER STATUS TO ACCEPT MESSAGES"
                },
                {
                    status:401
                }
            )

        }


        return Response.json(
            {
                success:true,
                message:"Message aacceptance status updation successfull",
                updatedUser
            },
            {
                status:200
            }
        )

        
    } catch (error) {
        console.log("FAILED TO UPDATE USER STATUS TO ACCEPT MESSAGES",error)
        return Response.json(
            {
                success:false,
                message:"FAILED TO UPDATE USER STATUS TO ACCEPT MESSAGES"
            },
            {
                status:500
            }
        )
    }
    
}


export async function GET(request:Request) {
    
    await dbConnect();

    const session = await getServerSession(authOptions);
    
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {
                status:401
            }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await Usermodel.findById(userId);
    
        if(!foundUser){
    
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:401
                }
            )
    
        }
    
        return Response.json(
            {
                success:true,
                isAcceptingMessages:foundUser.isAcceptingMessage
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Error in getting message acceptance status",error)
        return Response.json(
            {
                success:false,
                message:"Error in getting message acceptance status"
            },
            {
                status:500
            }
        )
    }
}