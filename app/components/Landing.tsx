"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Headphones className="h-8 w-8 text-primary" />
          <span className="ml-3 text-2xl font-bold tracking-tighter">
            MUZI
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="#features"
          >
            Features
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="text-sm font-medium"
              >
                Log out
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => signIn()}
                className="text-sm font-medium"
              >
                Sign In
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
          </div>
        </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-red-900/20 animate-gradient-xy" />
             <div className="absolute inset-0 bg-[url('/lib/hero-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  Let Your Fans Choose the Beat
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Connect with your audience in real-time. Let them shape your live streams with their favorite tracks.
                </p>
              </div>
              <div className="space-x-4">
                <Button 
                  className="h-12 px-8 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  onClick={handleRedirect}
                >
                  Get Started
                </Button>
                <Button variant="outline" className="h-12 px-8 text-lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Muzi ?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The ultimate platform for interactive music streaming.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <Mic2 className="h-12 w-12 text-purple-500 mb-4" />
                  <CardTitle>For Creators</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Engage your audience in real-time. Let them vote on the next track and keep the energy high.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <Users className="h-12 w-12 text-pink-500 mb-4" />
                  <CardTitle>For Fans</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Don't just watch—participate. Shape the live stream with your music choices and see your picks played live.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <Music className="h-12 w-12 text-red-500 mb-4" />
                  <CardTitle>Play your Favourites</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Just add the link to your song from Youtube and wait for it to be voted.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 w-full shrink-0 border-t">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row items-center px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2024 MusicStream. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
        </div>
      </footer>
      
    </div>
    
  );
}