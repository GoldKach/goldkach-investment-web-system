"use client"

// import { Header } from "@/components/header"
// import { Footer } from "@/components/footer"
import { moviesData } from "@/lib/movies-data"
import { seriesData } from "@/lib/series-data"
// import { documentariesData } from "@/lib/documentaries-data"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react" // Import Plus component
import { documentariesData } from "@/lib/documentary-data"

export default function Page() {
  // In a real app, this would come from user's saved list
  // For demo purposes, we'll show a sample of items
  const myMovies = moviesData.slice(0, 3)
  const mySeries = seriesData.slice(0, 2)
  const myDocs = documentariesData.slice(0, 2)

  const hasItems = myMovies.length > 0 || mySeries.length > 0 || myDocs.length > 0

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">My List</h1>
          <p className="text-muted-foreground text-lg">Your saved movies, series, and documentaries</p>
        </div>

        {!hasItems ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your list is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding movies, series, and documentaries to watch later</p>
            <div className="flex gap-4 justify-center">
              <Link href="/movies">
                <Button size="lg">Browse Movies</Button>
              </Link>
              <Link href="/series">
                <Button size="lg" variant="outline">
                  Browse Series
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Movies Section */}
            {myMovies.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Movies</h2>
                  <Link href="/movies">
                    <Button variant="ghost">View All Movies</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {myMovies.map((movie) => (
                    <div key={movie.id} className="group relative">
                      <Link href={`/movies/${movie.id}`}>
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                          <Image
                            src={movie.image || "/placeholder.svg"}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{movie.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-primary">★ {movie.rating}</span>
                              <span>•</span>
                              <span>{movie.year}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Series Section */}
            {mySeries.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Series</h2>
                  <Link href="/series">
                    <Button variant="ghost">View All Series</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {mySeries.map((series) => (
                    <div key={series.id} className="group relative">
                      <Link href={`/series/${series.id}`}>
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
                          </div>
                        </div>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentaries Section */}
            {myDocs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Documentaries</h2>
                  <Link href="/documentaries">
                    <Button variant="ghost">View All Documentaries</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {myDocs.map((doc) => (
                    <div key={doc.id} className="group relative">
                      <Link href={`/documentaries/${doc.id}`}>
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                          <Image
                            src={doc.image || "/placeholder.svg"}
                            alt={doc.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{doc.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-primary">★ {doc.rating}</span>
                              <span>•</span>
                              <span>{doc.year}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  )
}
