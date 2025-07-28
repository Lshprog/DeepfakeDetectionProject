"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShopItem, shopItems } from "./items"

export default function ShopPage() {
  const router = useRouter()
  const [points, setPoints] = useState(0)
  const [inventory, setInventory] = useState<number[]>([]) 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPoints = localStorage.getItem("points")
      setPoints(storedPoints ? parseInt(storedPoints, 10) : 0)

      const storedInventory = localStorage.getItem("inventory")
      setInventory(storedInventory ? JSON.parse(storedInventory) : [])
    }
  }, [])

  const handlePurchase = (item: ShopItem) => {
    if (points >= item.price && !inventory.includes(item.id)) {
      const newPoints = points - item.price
      const newInventory = [...inventory, item.id]

      setPoints(newPoints)
      setInventory(newInventory)

      localStorage.setItem("points", newPoints.toString())
      localStorage.setItem("inventory", JSON.stringify(newInventory))
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 bg-[url('/mascot/detective-pattern.svg')] bg-repeat bg-cover flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">Item Shop</h1>
          <div className="text-2xl font-semibold text-yellow-500">
            available credits: {points}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shopItems.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <img src={item.image} alt={item.name} className="rounded-t-lg h-48 w-full object-cover" />
                <CardTitle className="mt-4">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <Button
                  onClick={() => handlePurchase(item)}
                  disabled={points < item.price || inventory.includes(item.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {inventory.includes(item.id) ? "Purchased" : `Buy for ${item.price} Points`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
            <Button onClick={() => router.push('/game')} variant="outline">Back to Game</Button>
        </div>
      </div>
    </div>
  )
} 