'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/singnUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"
import { useDebounceCallback } from 'usehooks-ts'
import React from "react"
const Page = () => {
  const [username, setUsername]= useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, SetIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername,300)
  const { toast } = useToast()
  const router = useRouter()

  //zod implemented
  const form = useForm<z.infer<typeof signUpSchema>>(
    {
      resolver:zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:''
      }
    }
  )
  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('')

        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(response.data.message)
          setUsernameMessage(response.data.message)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking Username"
          )
        }finally{
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique()
  },[username])


  const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{

    SetIsSubmitting(true);

    try {

      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title:"Success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      SetIsSubmitting(false);
    } catch (error) {
      // console.log(error)
      console.error("Error in signup of error",error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message

      toast({
        title:"SignUp Error",
        description:errorMessage,
        variant:"destructive"
      })
      SetIsSubmitting(false);
    }

  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to VeilChat
          </h1>
          <p className="mb-4">Discover What They Really Think: Start Your Secret Conversations!</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username"
                {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              {
                isCheckingUsername && <Loader2 
                className="animate-spin"/>
              }
              <p className = {`text-sm ${usernameMessage ==='Username is Available'  ? 'text-green-500' :'text-red-600'}`}>
                 {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email"
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password"
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 2-4 animate-spin'/> Please Wait
              </>
            ) : ('signup')
          }
        </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
          <p>
            Already a Member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page