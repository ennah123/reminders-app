"use client"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
 
export function SignOut() {
  return <button className="cursor-pointer text-sm flex items-center gap-2" onClick={() => signOut()}>log out<LogOut className="w-4" /></button>
}