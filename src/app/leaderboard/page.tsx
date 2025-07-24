"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockedUsers = [
  { username: "user2", points: 7 },
  { username: "user3", points: 5 },
  { username: "user4", points: 3 },
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
    { username: "Alice", points: userPoints },
    ...mockedUsers,
  ].sort((a, b) => b.points - a.points)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col items-center justify-center">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-red-800 text-center">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {leaderboard.map((entry, idx) => (
              <li key={entry.username} className={`flex justify-between py-3 px-2 ${entry.username === "Alice" ? "font-bold text-blue-700" : ""}`}>
                <span>{idx + 1}. {entry.username}</span>
                <span className="text-red-700 font-bold">{entry.points} pts</span>
              </li>
            ))}
          </ul>
          <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push("/game")}>Back to Game</Button>
        </CardContent>
      </Card>
    </div>
  )
} 