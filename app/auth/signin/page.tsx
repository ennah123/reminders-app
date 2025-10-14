'use client'

import { signIn } from "next-auth/react"
import Lottie from "lottie-react";
import timeTable from "@/public/TimeTable.json";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-semibold mb-6">Welcome Back 👋</h1>

      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Continue with Google
      </button>
      <Lottie
        animationData={timeTable}
        loop={true}
        style={{ width: 300, height: 300 }}
      />

      <p className="text-sm text-gray-500 mt-6">
        Or continue with another method...
      </p>
    </div>
  )
}
