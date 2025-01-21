"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Headphones, Mic2, Users, Music, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
export default function Landing() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRedirect = () => {
    if (mounted) {
      router.push('/dashboard')
    }
  }

  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b dark:border-gray-700 shadow-md">
        {/* Header content remains the same */}
        <Link className="flex items-center justify-center" href="#">
          <Headphones className="h-8 w-8 text-purple-500 dark:text-purple-400" />
          <span className="ml-3 text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            MUZI
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          {/* Navigation content remains the same */}
          <Link
            className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline underline-offset-4 transition-colors duration-200"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline underline-offset-4 transition-colors duration-200"
            href="#"
          >
            Pricing
          </Link>
          <div>
            {session?.user ? (
              <button
                className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline underline-offset-4 transition-colors duration-200"
                onClick={() => signOut()}
              >
                Log out
              </button>
            ) : (
              <button
                className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline underline-offset-4 transition-colors duration-200"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="ml-4"
          >
            {darkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full min-h-[600px] flex items-center justify-center">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"
            style={{
              backgroundImage: "../lib/hero-bg.jpg",
            }}
          />
            <div className="absolute inset-0 bg-purple-900/60" />
          {/* Content */}
          <div className="relative container mx-auto px-6 text-center ">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-6">
              Let Your Fans Choose the Beat
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto mb-8">
              Connect with your audience. Let them shape your live streams with
              their favorite tracks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700 rounded-lg px-8 py-3 transition-all duration-300" 
                onClick={handleRedirect}
              >
                Get Started
              </Button>
              <Input
                className="max-w-xs bg-white/10 text-white placeholder:text-white/70 border-white/20 rounded-lg"
                placeholder="Enter your email"
                type="email"
              />
            </div>
          </div>
        </section>

        {/* Rest of the sections remain the same */}
        <section className="w-full py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Why MusicStream?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <Mic2 className="h-12 w-12 text-purple-500 dark:text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  For Creators
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Engage your audience in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-12 w-12 text-pink-500 dark:text-pink-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  For Fans
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Shape live streams with your choices.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Music className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Vast Library
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access millions of tracks instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer remains the same */}
      </main>

      <footer className="flex items-center justify-between py-6 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 MusicStream. All rights reserved.
        </p>
        <nav className="flex space-x-4">
          <Link
            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            href="#"
          >
            Terms
          </Link>
          <Link
            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}