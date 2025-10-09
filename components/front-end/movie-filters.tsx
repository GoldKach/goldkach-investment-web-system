"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MovieFiltersProps {
  onFilterChange: (filters: {
    genre: string
    vj: string
    year: string
    search: string
  }) => void
}

export function MovieFilters({ onFilterChange }: MovieFiltersProps) {
  const [genre, setGenre] = useState("all")
  const [vj, setVj] = useState("all")
  const [year, setYear] = useState("all")
  const [search, setSearch] = useState("")

  const handleFilterChange = (newGenre?: string, newVj?: string, newYear?: string, newSearch?: string) => {
    const filters = {
      genre: newGenre ?? genre,
      vj: newVj ?? vj,
      year: newYear ?? year,
      search: newSearch ?? search,
    }

    onFilterChange(filters)
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search movies..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleFilterChange(undefined, undefined, undefined, e.target.value)
            }}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {/* Genre Filter */}
        <Select
          value={genre}
          onValueChange={(value:any) => {
            setGenre(value)
            handleFilterChange(value)
          }}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="drama">Drama</SelectItem>
            <SelectItem value="sci-fi">Sci-Fi</SelectItem>
            <SelectItem value="thriller">Thriller</SelectItem>
            <SelectItem value="comedy">Comedy</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
            <SelectItem value="romance">Romance</SelectItem>
          </SelectContent>
        </Select>

        {/* VJ/Translation Filter */}
        <Select
          value={vj}
          onValueChange={(value:any) => {
            setVj(value)
            handleFilterChange(undefined, value)
          }}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Translation Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Movies</SelectItem>
            <SelectItem value="translated">Translated</SelectItem>
            <SelectItem value="non-translated">Non-Translated</SelectItem>
            <SelectItem value="VJ Junior">VJ Junior</SelectItem>
            <SelectItem value="VJ Emmy">VJ Emmy</SelectItem>
            <SelectItem value="VJ Ice P">VJ Ice P</SelectItem>
            <SelectItem value="VJ Mark">VJ Mark</SelectItem>
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select
          value={year}
          onValueChange={(value:any) => {
            setYear(value)
            handleFilterChange(undefined, undefined, value)
          }}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Release Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {(genre !== "all" || vj !== "all" || year !== "all" || search) && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {genre !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGenre("all")
                handleFilterChange("all")
              }}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              {genre} ×
            </Button>
          )}
          {vj !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setVj("all")
                handleFilterChange(undefined, "all")
              }}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              {vj} ×
            </Button>
          )}
          {year !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setYear("all")
                handleFilterChange(undefined, undefined, "all")
              }}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              {year} ×
            </Button>
          )}
          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("")
                handleFilterChange(undefined, undefined, undefined, "")
              }}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              "{search}" ×
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
