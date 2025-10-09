"use client"

import { useState } from "react"
import { Calendar, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Movie {
  id: number
  title: string
  image: string
  releaseDate: string
  genre: string
  description: string
}

interface ComingSoonProps {
  movies: Movie[]
}

export function ComingSoon({ movies }: ComingSoonProps) {
  const [notified, setNotified] = useState<number[]>([])

  const handleNotify = (id: number) => {
    setNotified((prev) => (prev.includes(id) ? prev.filter((movieId) => movieId !== id) : [...prev, id]))
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Coming Soon</h2>
        <Calendar className="w-6 h-6 text-accent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={movie.image || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded">{movie.genre}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {movie.releaseDate}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{movie.description}</p>

              <Button
                onClick={() => handleNotify(movie.id)}
                variant={notified.includes(movie.id) ? "default" : "outline"}
                className="w-full group/btn"
              >
                <Bell
                  className={`w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110 ${
                    notified.includes(movie.id) ? "fill-current" : ""
                  }`}
                />
                {notified.includes(movie.id) ? "Notification Set" : "Notify Me"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
