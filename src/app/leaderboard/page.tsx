"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockedUsers = [
  { username: "Shinichi", points: 7 },
  { username: "Heiji", points: 5 },
  { username: "Mouri", points: 3 },
]

export default function LeaderboardPage() {
  const router = useRouter()
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("points")
      setUserPoints(stored ? parseInt(stored, 10) : 0)
    }
  }, [])

  // Combine and sort
  const leaderboard = [
    { username: "Conan", points: userPoints },
    ...mockedUsers,
  ].sort((a, b) => b.points - a.points)

  return (
    <div className="min-h-screen bg-blue-950 bg-[url('/mascot/detective-pattern.svg')] bg-repeat bg-cover flex flex-col items-center justify-center">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-red-800 text-center">Detective Rank</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {leaderboard.map(user => (
              <div key={user.username} className="flex items-center gap-3 py-2">
                <img
                  src={`/profile-pics/${user.username}.png`}
                  alt={`${user.username}'s profile`}
                  className="rounded-full border border-gray-300 object-cover"
                  style={{ aspectRatio: '1/1', maxWidth: 40, maxHeight: 40 }}
                  onError={e => { e.currentTarget.src = '/profile-pics/default.png'; }} // fallback if missing
                />
                <span className="font-semibold">{user.username}</span>
                <span className="ml-auto">{user.points}</span>
              </div>
            ))}
          </ul>
          <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push("/game")}>Back to Game</Button>
        </CardContent>
      </Card>
      <img
        src="/wallpapers/Kaito_Kid.webp"
        alt="Kaito_Kid"
        className="w-80 md:w-100 fixed bottom-0 right-4 md:right-8 z-40 drop-shadow-lg select-none pointer-events-none animate-mascot-pop"
      />
    </div>
  )
} 