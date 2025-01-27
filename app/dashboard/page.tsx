'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Moon, Sun, Share2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
// Mock data for demonstration
const initialQueue = [
  { id: 1, title: "Barsaat Bana Lo", votes: 5, videoId: "ZflXzCegeGc" },
  { id: 2, title: "Bikhra", votes: 3, videoId: "aRzbHxJZSTo" },
  { id: 3, title: "Sunday", votes: 1, videoId: "lpyQhpksHRI" },
]

export default function SongVotingQueue() {
  const [darkMode, setDarkMode] = useState(true)
  const [queue, setQueue] = useState(initialQueue)
  const [currentVideo, setCurrentVideo] = useState("")
  const [inputLink, setInputLink] = useState("")
  const [previewVideo, setPreviewVideo] = useState("")
  const [showShareAlert, setShowShareAlert] = useState(false)
  const playerRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Load queue from URL parameters if they exist
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queueParam = params.get('queue')
    if (queueParam) {
      try {
        const decodedQueue = JSON.parse(atob(queueParam))
        setQueue(decodedQueue)
      } catch (error) {
        console.error('Failed to parse queue from URL:', error)
      }
    }
  }, [])

  // const onPlayerStateChange = (event: any) => {
  //   if (event.data === 0) {
  //     playNextSong()
  //   }
  // }

  // const playNextSong = () => {
  //   if (queue.length > 0) {
  //     const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes)
  //     const nextSong = sortedQueue[0]
  //     handlePlay(nextSong.videoId)
  //   }
  // }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = extractVideoId(inputLink)
    if (videoId) {
      setQueue([...queue, { id: Date.now(), title: `New Song ${queue.length + 1}`, votes: 0, videoId }])
      setInputLink("")
      setPreviewVideo("")
    }
  }

  const handleVote = (id: number, increment: number) => {
    setQueue(
      queue
        .map(item => (item.id === id ? { ...item, votes: item.votes + increment } : item))
        .sort((a, b) => b.votes - a.votes)
    )
  }

  const handlePlay = (videoId: string) => {
    setCurrentVideo(videoId)
    setQueue(queue.filter(item => item.videoId !== videoId))
  }

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleShare = () => {
    const encodedQueue = btoa(JSON.stringify(queue))
    const shareableUrl = `${window.location.origin}${window.location.pathname}?queue=${encodedQueue}`
    navigator.clipboard.writeText(shareableUrl).then(() => {
      setShowShareAlert(true)
      setTimeout(() => setShowShareAlert(false), 3000)
    })
  }
  
  async function refreshStreamInterval() {
    await fetch("api/streams", {
      method:"POST",
      body: JSON.stringify({
        createdId: "",
        url:inputLink
      })
    });
  }

  useEffect(() => {
    refreshStreamInterval()
    const interval = setInterval(() => {
      refreshStreamInterval()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Queue
          </Button>
        </div>

        {showShareAlert && (
          <Alert className="mb-4">
            <AlertDescription>Share link copied to clipboard!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Add a Song</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Paste YouTube link here"
                  value={inputLink}
                  onChange={(e) => {
                    setInputLink(e.target.value)
                    const videoId = extractVideoId(e.target.value)
                    if (videoId) setPreviewVideo(videoId)
                  }}
                />
                <Button type="submit" className="w-full">Add to Queue</Button>
              </form>
              {previewVideo && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2">Preview</h3>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${previewVideo}`}
                      allowFullScreen
                      className="rounded-md"
                    ></iframe>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Upcoming Songs</h2>
              <ul className="space-y-4">
                {queue.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 bg-white dark:bg-gray-700 p-2 rounded-lg shadow">
                    <div className="flex-shrink-0">
                      <Image
                        src={`https://img.youtube.com/vi/${item.videoId}/default.jpg`}
                        alt={item.title}
                        width={120}
                        height={90}
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleVote(item.id, 1)}>
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="sr-only">Upvote</span>
                        </Button>
                        <span className="text-sm font-medium">{item.votes}</span>
                        <Button size="sm" variant="outline" onClick={() => handleVote(item.id, -1)}>
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          <span className="sr-only">Downvote</span>
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handlePlay(item.videoId)}>
                          <Play className="w-4 h-4 mr-1" />
                          <span className="sr-only">Play</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Now Playing Card */}
        <div className="mt-8">
          <Card className="mx-auto max-w-3xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
              {currentVideo ? (
                <div className="aspect-video">
                  <iframe
                    ref={playerRef}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <p>No video currently playing</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
