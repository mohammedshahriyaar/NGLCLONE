import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { request } from "http";


export async function POST(request:Request) {

    await dbConnect();

    try {
        const {username,code} = await request.json();

        const decodedUsername = decodeURIComponent(username)

        const user = await Usermodel.findOne({username:decodedUsername})

        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:404
                }
            )
        }

        const isCodevalid  = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodevalid && isCodeNotExpired){
            user.isVerified = true;
            await user.save()
            return Response.json(
                {
                    success:true,
                    message:"Account Verified Sucessfully"
                },
                {
                    status:200
                }
            )

        }
        else if(!isCodeNotExpired){

            return Response.json(
                {
                    success:false,
                    message:"Verification code has expired Please signup again for new code"
                },
                {
                    status:400
                }
            )
        }
        else{
            return Response.json(
                {
                    success:false,
                    message:"Incorrect Verification code "
                },
                {
                    status:400
                }
            )
        }

    } catch (error) {
        console.error("Error Verifying User",error);
        return Response.json(
            {
                success:false,
                message:"Error Verifying User"
            },
            {
                status:500
            }
        )
        
    }
}