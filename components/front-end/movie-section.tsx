"use client"

import { useState } from "react"
import { ArrowBigDown, ChevronLeft, ChevronRight, Play, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip } from "../ui/tooltip"

interface Movie {
  id: number
  title: string
  image: string
  rating: number
  year: number
  genre: string
}

interface MovieSectionProps {
  title: string
  movies: Movie[]
}

export function MovieSection({ title, movies }: MovieSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, "-")}`)
    if (container) {
      const scrollAmount = 320
      const newPosition =
        direction === "left" ? Math.max(0, scrollPosition - scrollAmount) : scrollPosition + scrollAmount

      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => scroll("left")} className="hover:bg-secondary">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll("right")} className="hover:bg-secondary">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        id={`scroll-${title.replace(/\s+/g, "-")}`}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 w-72 group cursor-pointer"
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            <div className="relative overflow-hidden rounded-lg bg-card transition-transform duration-300 group-hover:scale-105">
              <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-96 object-cover" />

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                  hoveredMovie === movie.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 golden-glow">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button title="add to my list" size="sm" variant="outline" className="border-white/20 hover:bg-primary bg-slate-400/30">
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button size="sm" title="download" variant="outline" className="border-white/20 hover:bg-primary bg-slate-400/30">
                        <ArrowBigDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{movie.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-balance">{movie.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span>{movie.genre}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
