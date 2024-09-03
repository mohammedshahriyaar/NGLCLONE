"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Message } from "@/model/User";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { Axios, AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { MessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";


const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestButtonLoading, setIsSuggestButtonLoading] = useState(false);
  const { toast } = useToast();
  const [text, setText] = useState("");
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const initialString ="What is your hobby?|| What is your favouraite Sport?|| Whats your pet Name"
  const seperator = '||'
  const params = useParams<{username:string}>();

  const splitString = (stream: string): string[]=>{
    return stream.split(seperator);
  }

  //sending message
  async function onMessageSubmit(data: z.infer<typeof MessageSchema>) {

    setIsLoading(true);
    try {

      const response = await axios.post('/api/send-message',{
        username:params.username,
        content:data.content
      })

      if(response.data.success){
        toast({
          title: "success",
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
    toast({
      title:"error",
      description:axiosError.response?.data.message ,
      variant:"destructive"
    })
    }
    finally{
      setIsLoading(false)
    }

  }

  //setting suggested input to form
  function handleTextMessage(data:string){
    form.setValue('content',data)
  }
  async function SuggestMessage(){
    setIsSuggestButtonLoading(true);
    try {

      const result = await axios.post('/api/suggest-messages');
      const response = result.data.message.candidates[0].content.parts[0].text;
      setText(response)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"error",
        description:axiosError.response?.data.message ,
        variant:"destructive"
      })
    }finally{
      setIsSuggestButtonLoading(false);
    }

  }

  const watchContent = form.watch("content");

  return (
    <div className="container mx-auto my-8 p-6  rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Your Public URL
      </h1>
      <Form {...form}>
        <form
          className=" space-y-6"
          onSubmit={form.handleSubmit(onMessageSubmit)}
        >
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <>
                <FormLabel>
                  {" "}
                  Send Anonymous Message to # {params.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Drop Your Anonymous Message Here "
                    className="resize-none "
                    {...field}
                  />
                </FormControl>
              </>
            )}
          ></FormField>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !watchContent}>
              Send It
            </Button>
          )}
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
        <Button
            className="my-4"
            onClick={SuggestMessage}
            disabled={isSuggestButtonLoading}
          >
            Suggest Message{" "}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="font-bold"> Some Random Messages to choose from</CardHeader>
        <CardContent className="flex flex-col space-y-4 ">
          {
            text === "" ? (
              splitString(initialString).map((data,idx)=>(
                <Button
                className="border bg-black"
                key={idx}
                onClick={() => handleTextMessage(data)}
              >
                {data}
              </Button>

              ))
            ) : (
              splitString(text).map((data,idx)=>(
                <Button
                    className=" border bg-black "
                    key={idx}
                    onClick={() => handleTextMessage(data)}
                  >
                    {data}
                  </Button>
              ))
            )
          }

        </CardContent>
      </Card>

      <Separator className="my-8" />
      <div className="text-center">
        <div className="mb-4">Join the Fun and Get Your Message Dashboard</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>



    </div>
  )
}

export default page