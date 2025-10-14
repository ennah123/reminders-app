'use client'

import { signIn } from "next-auth/react"
import { useState } from 'react'
import { toast } from 'sonner'
import Lottie from "lottie-react";
import timeTable from "@/public/TimeTable.json";

export default function SignInPage() {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    const loadingToast = toast.loading('Signing you in...')
    
    try {
      await signIn('google', { callbackUrl: '/' })
      toast.dismiss(loadingToast)
      toast.success('Welcome back!')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Sign In Card */}
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-500 text-sm">
                  Sign in to access your reminders
                </p>
              </div>

              {/* Google Sign In Button */}
              <div className="space-y-6">
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  } text-gray-900 py-3 px-4 font-medium text-sm tracking-wide rounded-lg transition-all duration-200 shadow-sm`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>

              {/* Footer Text */}
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-gray-700 hover:text-gray-900 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-gray-700 hover:text-gray-900 underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration and Info */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="mb-8">
              <Lottie
                animationData={timeTable}
                loop={true}
                className="w-full max-w-md"
              />
            </div>
            
            <div className="text-center lg:text-right">
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Smart Reminder
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-md">
                Stay organized and never miss important tasks with our intelligent reminder system.
              </p>
              
              {/* Features List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-end text-gray-700">
                  <span className="ml-3">Create and manage reminders effortlessly</span>
                  <svg className="w-5 h-5 text-green-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center justify-end text-gray-700">
                  <span className="ml-3">Get timely notifications</span>
                  <svg className="w-5 h-5 text-green-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center justify-end text-gray-700">
                  <span className="ml-3">Sync across all your devices</span>
                  <svg className="w-5 h-5 text-green-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-light text-gray-900 mb-1">1K+</p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-light text-gray-900 mb-1">10K+</p>
            <p className="text-sm text-gray-500">Reminders Created</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-light text-gray-900 mb-1">99%</p>
            <p className="text-sm text-gray-500">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </main>
  )
}