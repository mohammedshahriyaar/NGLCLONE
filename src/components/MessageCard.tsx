'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

import { useToast } from "./ui/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { TrashIcon, X } from "lucide-react"
import { Message } from "@/model/User"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import dayjs from 'dayjs';
type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};




const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        try {
          const response = await axios.delete<ApiResponse>(
            `/api/delete-message/${message._id}`
          );
          toast({
            title: response.data.message,
          });
          
          onMessageDelete(message._id as string);
    
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ?? 'Failed to delete message',
            variant: 'destructive',
          });
        } 
      };

  return (
    // <Card>
    //     <CardHeader>
    //         <CardTitle>Card Title</CardTitle>
    //         <AlertDialog>
    //         <AlertDialogTrigger asChild>
    //             <Button variant="outline"><X className="w-5 h-5" /></Button>
    //         </AlertDialogTrigger>
    //         <AlertDialogContent>
    //             <AlertDialogHeader>
    //             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    //             <AlertDialogDescription>
    //                 This action cannot be undone. This will permanently delete your
    //                 account and remove your data from our servers.
    //             </AlertDialogDescription>
    //             </AlertDialogHeader>
    //             <AlertDialogFooter>
    //             <AlertDialogCancel>Cancel</AlertDialogCancel>
    //             <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
    //             </AlertDialogFooter>
    //         </AlertDialogContent>
    //         </AlertDialog>
    //         <CardDescription>Card Description</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //     </CardContent>
    //     <CardFooter>
    //     </CardFooter>
    // </Card>
    <div>
      <main className="flex-1 overflow-y-auto p-3 m-4 rounded-lg ">
        <div className="space-y-4">
          <div className=" rounded-lg shadow p-4">
            <div className="flex items-start justify-between align-middle">
              <p className="mr-2">{message.content}</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="text-gray-500 hover:text-red-500"
                    size="icon"
                    variant="ghost"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span className="sr-only">Delete message</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
              <div className="text-sm">
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
              </div>
          </div>
        </div>
      </main>
    </div>

  )
}

export default MessageCard