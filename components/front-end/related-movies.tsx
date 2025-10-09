"use client"

import { useState } from "react"
import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Movie {
  id: number
  title: string
  image: string
  rating: number
  year: number
  genre: string
  length: string
}

interface RelatedMoviesProps {
  movies: Movie[]
}

export function RelatedMovies({ movies }: RelatedMoviesProps) {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)

  if (movies.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Related Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            <div className="relative overflow-hidden rounded-lg bg-card transition-transform duration-300 group-hover:scale-105">
              <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-64 object-cover" />

              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span className="text-xs font-semibold text-white">{movie.rating}</span>
              </div>

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
                  hoveredMovie === movie.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                  <h3 className="font-semibold text-white text-sm line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center space-x-1 text-xs text-white/70">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.length}</span>
                  </div>
                  <Link href={`/movies/${movie.id}`}>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 golden-glow text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
