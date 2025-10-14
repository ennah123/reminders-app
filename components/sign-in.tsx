"use client"
import { LogIn } from "lucide-react"
import { signIn } from "next-auth/react"
 
export function SignIn() {
  return <button className="cursor-pointer text-sm flex items-center gap-2" onClick={() => signIn()}>log in<LogIn className="w-4" /></button>
}