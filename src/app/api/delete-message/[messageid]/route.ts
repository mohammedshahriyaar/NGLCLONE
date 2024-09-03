import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import Usermodel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function DELETE(
    request:Request,
    {params}: {params:{messageid: string}}
) {
    const messageId = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user;

    if(!session || !session.user){
        return Response.json(
            {
                sucess:false,
                message:"Not authenticated"
            },
            {
                status:401
            }
        )
    }

    try {

        const updatedUser = await Usermodel.updateOne(
            { _id: user._id },
            {
                $pull: { messages: { _id: messageId } }, // Corrected $pull operator
            }
        );
        if (updatedUser.modifiedCount == 0) {
            return Response.json(
              {
                success: false,
                message: "Message not found or it may be deleted",
              },
              { status: 404 }
            );
        }

        return Response.json(
            {
              success: true,
              message: "Message deleted",
            },
            { status: 200 }
          );
        
        
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: error,
            },
            { status: 500 }
          );
        
    }


    
}