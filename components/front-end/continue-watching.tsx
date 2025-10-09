"use client"

import { Play, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const continueWatchingData = [
  {
    id: 1,
    title: "Blackbird",
    episode: "S2 E4",
    progress: 65,
    image: "/8fdeb8f8cc9b17c0c17cb6c5ae0fd35c.jpg",
    timeLeft: "23 min left",
  },
  {
    id: 2,
    title: "La Familia",
    episode: "S1 E8",
    progress: 80,
    image: "/52de501356165abb489c3cc24f07e64e.jpg",
    timeLeft: "12 min left",
  },
  {
    id: 3,
    title: "The Search",
    episode: "Movie",
    progress: 45,
    image: "/8507f90d74a40b47290766ce6f373043.jpg",
    timeLeft: "1h 15min left",
  },
]

export function ContinueWatching() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Continue Watching</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {continueWatchingData.map((item) => (
          <div key={item.id} className="group relative">
            <div className="relative overflow-hidden rounded-lg bg-card">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${item.progress}%` }} />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 golden-glow">
                  <Play className="w-6 h-6" />
                </Button>
              </div>

              {/* More Options */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/20 hover:bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-3 space-y-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{item.episode}</span>
                <span>{item.timeLeft}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
