"use client"

import { useState } from "react"
import { seriesData } from "@/lib/series-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SeriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedVJ, setSelectedVJ] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")

  const genres = ["All", ...Array.from(new Set(seriesData.map((s) => s.genre)))]
  const vjs = ["All", "Translated", "Non-Translated"]
  const years = [
    "All",
    ...Array.from(new Set(seriesData.map((s) => s.year.toString())))
      .sort()
      .reverse(),
  ]

  const filteredSeries = seriesData.filter((series) => {
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === "All" || series.genre === selectedGenre
    const matchesVJ =
      selectedVJ === "All" ||
      (selectedVJ === "Translated" && series.vj) ||
      (selectedVJ === "Non-Translated" && !series.vj)
    const matchesYear = selectedYear === "All" || series.year.toString() === selectedYear

    return matchesSearch && matchesGenre && matchesVJ && matchesYear
  })

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">TV Series</h1>
          <p className="text-muted-foreground text-lg">Binge-worthy shows and series</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary border-border text-lg"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Genre Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Genre</label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGenre(genre)}
                    className={selectedGenre === genre ? "bg-primary text-primary-foreground" : ""}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            {/* VJ Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Translation</label>
              <div className="flex flex-wrap gap-2">
                {vjs.map((vj) => (
                  <Button
                    key={vj}
                    variant={selectedVJ === vj ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVJ(vj)}
                    className={selectedVJ === vj ? "bg-primary text-primary-foreground" : ""}
                  >
                    {vj}
                  </Button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Year</label>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    className={selectedYear === year ? "bg-primary text-primary-foreground" : ""}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredSeries.length} {filteredSeries.length === 1 ? "series" : "series"}
          </p>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredSeries.map((series) => (
            <Link key={series.id} href={`/series/${series.id}`} className="group">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                <Image
                  src={series.image || "/placeholder.svg"}
                  alt={series.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{series.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">★ {series.rating}</span>
                    <span>•</span>
                    <span>{series.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>
                      {series.seasons} Season{series.seasons > 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>{series.episodes} Episodes</span>
                  </div>
                  {series.vj && (
                    <div className="mt-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{series.vj}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredSeries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No series found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}
