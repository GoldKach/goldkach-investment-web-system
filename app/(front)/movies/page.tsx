"use client"

import { useState } from "react"
import { moviesData } from "@/lib/movies-data"
import { MovieFilters } from "@/components/front-end/movie-filters"
import { MovieGrid } from "@/components/front-end/movie-grid"
import { Footer } from "@/components/front-end/footer"

export default function MoviesPage() {
  const [filteredMovies, setFilteredMovies] = useState(moviesData)

  const handleFilterChange = (filters: {
    genre: string
    vj: string
    year: string
    search: string
  }) => {
    let filtered = [...moviesData]

    // Filter by genre
    if (filters.genre !== "all") {
      filtered = filtered.filter((movie) => movie.genre.toLowerCase() === filters.genre.toLowerCase())
    }

    // Filter by VJ/Translation status
    if (filters.vj !== "all") {
      if (filters.vj === "translated") {
        filtered = filtered.filter((movie) => movie.vj)
      } else if (filters.vj === "non-translated") {
        filtered = filtered.filter((movie) => !movie.vj)
      } else {
        // Specific VJ
        filtered = filtered.filter((movie) => movie.vj === filters.vj)
      }
    }

    // Filter by year
    if (filters.year !== "all") {
      filtered = filtered.filter((movie) => movie.year.toString() === filters.year)
    }

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter((movie) => movie.title.toLowerCase().includes(filters.search.toLowerCase()))
    }

    setFilteredMovies(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Movies</h1>
          <p className="text-muted-foreground">Discover our collection of {moviesData.length} premium movies</p>
        </div>

        <MovieFilters onFilterChange={handleFilterChange} />
        <MovieGrid movies={filteredMovies} />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
