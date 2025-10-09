"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

const heroMovies = [
  {
    id: 1,
    title: "Quantum Horizon",
    description:
      "In a world where reality bends to quantum mechanics, a brilliant physicist discovers the key to manipulating time itself. But with great power comes devastating consequences.",
    image: "/8507f90d74a40b47290766ce6f373043.jpg",
    rating: 8.9,
    year: 2024,
    genre: "Sci-Fi Thriller",
  },
  {
    id: 2,
    title: "The Last Symphony",
    description:
      "A renowned conductor's final performance becomes a journey through memory, love, and the transformative power of music in this emotionally charged masterpiece.",
    image: "/8fdeb8f8cc9b17c0c17cb6c5ae0fd35c.jpg",
    rating: 9.2,
    year: 2024,
    genre: "Drama",
  },
  {
    id: 3,
    title: "Shadow Protocol",
    description:
      "When a covert operation goes wrong, an elite agent must navigate a web of betrayal and conspiracy to uncover the truth behind a global conspiracy.",
    image: "/e0f205758f1bc8f56000b8823130b0e6.jpg",
    rating: 8.5,
    year: 2024,
    genre: "Action Thriller",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMovies.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroMovies.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroMovies.length) % heroMovies.length)
  }

  const currentMovie = heroMovies[currentSlide]

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentMovie.image})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="px-4 md:px-8 lg:px-12 max-w-2xl">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="text-primary font-semibold">{currentMovie.year}</span>
              <span>•</span>
              <span>{currentMovie.genre}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span className="text-primary">★</span>
                <span>{currentMovie.rating}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">{currentMovie.title}</h1>

            <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-xl">
              {currentMovie.description}
            </p>

            <div className="flex items-center space-x-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground golden-glow">
                <Play className="w-5 h-5 mr-2" />
                Play Now
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary bg-transparent">
                <Plus className="w-5 h-5 mr-2" />
                My List
              </Button>
              <Button size="lg" variant="ghost" className="hover:bg-secondary">
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary golden-glow" : "bg-muted-foreground/50 hover:bg-muted-foreground"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
