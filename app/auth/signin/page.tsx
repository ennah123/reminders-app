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
    <main className="min-h-screen flex items-center">
      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          {/* Left Side - Text Content and Illustration */}
          <div className="flex flex-col items-center lg:items-start">
            {/* Text Content */}
            <div className="text-center lg:text-left max-w-md mb-8">
              <h1 className="font-serif text-3xl lg:text-4xl text-slate-800 mb-4 font-medium">
                Smart Reminder
              </h1>
              <p className="text-base text-slate-600 mb-6 leading-relaxed">
                Stay organized and never miss important tasks with our intelligent reminder system. 
                
              </p>
              
              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center text-slate-700">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Easy reminder creation and management</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Timely notifications and alerts</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Cross-device synchronization</span>
                </div>
              </div>
            </div>

            {/* Lottie Animation - Smaller */}
            <div className="w-full max-w-xs lg:max-w-sm">
              <Lottie
                animationData={timeTable}
                loop={true}
                className="w-full"
              />
            </div>
          </div>

          {/* Right Side - Sign In Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-slate-800 mb-3 font-medium">
                  Welcome Back
                </h2>
                <p className="text-slate-600">
                  Sign in to manage your smart reminders
                </p>
              </div>

              {/* Google Sign In Button */}
              <div className="space-y-6">
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-4 ${
                    loading 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-white border border-slate-300 hover:border-slate-400 hover:shadow-md'
                  } text-slate-800 py-3 px-6 font-medium text-sm tracking-wide rounded-lg transition-all duration-200 shadow-sm`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      <span className="text-slate-700">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-lg p-1">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <span className="text-slate-700">Continue with Google</span>
                    </>
                  )}
                </button>
              </div>

              {/* Footer Text */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-slate-800 hover:text-slate-900 font-medium transition-colors duration-200 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-slate-800 hover:text-slate-900 font-medium transition-colors duration-200 underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}