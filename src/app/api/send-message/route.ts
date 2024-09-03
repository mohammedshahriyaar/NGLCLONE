import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request:Request) {

    await dbConnect();

    const{username,content} = await request.json()

    try {

        const user = await Usermodel.findOne({username})

        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User Not found"
                },
                {
                    status:404
                }
            )
        }

        //is useraccepting messages

        if(!user.isAcceptingMessage){

            return Response.json(
                {
                    success:false,
                    message:"User is not accepting messages"
                },
                {
                    status:403
                }
            )
        }

        const newMessage ={content,createdAt: new Date()}

        user.messages.push(newMessage as Message)

        await user.save()
        return Response.json(
            {
                success:true,
                message:"Message sent successfully"
            },
            {
                status:201
            }
        )
        
    } catch (error) {
        console.log("Error sending Message",error)
        return Response.json(
            {
                success:false,
                message:"Error sending Message"
            },
            {
                status:500
            }
        )
    }
    
}