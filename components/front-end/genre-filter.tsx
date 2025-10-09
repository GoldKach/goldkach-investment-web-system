"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const genres = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Horror",
  "Documentary",
  "Animation",
]

export function GenreFilter() {
  const [activeGenre, setActiveGenre] = useState("All")

  return (
    <section>
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={activeGenre === genre ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap ${
              activeGenre === genre
                ? "bg-primary text-primary-foreground golden-glow"
                : "border-border hover:bg-secondary"
            }`}
            onClick={() => setActiveGenre(genre)}
          >
            {genre}
          </Button>
        ))}
      </div>
    </section>
  )
}
