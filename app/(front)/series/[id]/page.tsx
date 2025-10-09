"use client"

import { use } from "react"
import { seriesData } from "@/lib/series-data"
import { Button } from "@/components/ui/button"
import { Play, Plus, Share2, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const series = seriesData.find((s) => s.id === Number.parseInt(id))
  const [selectedEpisode, setSelectedEpisode] = useState(series?.episodesList[0])
  const [isPlaying, setIsPlaying] = useState(false)

  if (!series) {
    return <div>Series not found</div>
  }

  const relatedSeries = seriesData.filter((s) => s.genre === series.genre && s.id !== series.id).slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Video Player Section */}
        <div className="relative w-full aspect-video bg-black">
          {!isPlaying ? (
            <div className="relative w-full h-full">
              <Image src={series.poster || "/placeholder.svg"} alt={series.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-20 h-20"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="w-8 h-8 ml-1" fill="currentColor" />
                </Button>
              </div>
            </div>
          ) : (
            <video
              src={selectedEpisode?.videoUrl}
              poster={selectedEpisode?.poster}
              controls
              autoPlay
              className="w-full h-full"
            />
          )}
        </div>

        {/* Series Info */}
        <div className="px-4 md:px-8 lg:px-12 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{series.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="text-lg font-semibold text-foreground">{series.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{series.year}</span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">{series.genre}</span>
                  <span className="text-muted-foreground">
                    {series.seasons} Season{series.seasons > 1 ? "s" : ""}
                  </span>
                  <span className="text-muted-foreground">{series.episodes} Episodes</span>
                  <span className="text-muted-foreground">{series.views} views</span>
                </div>

                {series.vj && (
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                      Translated by {series.vj}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 mb-8">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Play className="w-5 h-5 mr-2" fill="currentColor" />
                    Play Episode {selectedEpisode?.episodeNumber}
                  </Button>
                  <Button size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    My List
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{series.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Director</h3>
                    <p className="text-foreground">{series.director}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Cast</h3>
                    <p className="text-foreground">{series.cast.join(", ")}</p>
                  </div>
                </div>

                {/* Episodes List */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Episodes</h2>
                  <div className="space-y-3">
                    {series.episodesList.map((episode) => (
                      <div
                        key={episode.id}
                        className={`flex gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedEpisode?.id === episode.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => {
                          setSelectedEpisode(episode)
                          setIsPlaying(false)
                        }}
                      >
                        <div className="relative w-32 h-20 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={episode.poster || "/placeholder.svg"}
                            alt={episode.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" fill="white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-foreground">
                              {episode.episodeNumber}. {episode.title}
                            </h3>
                            <span className="text-sm text-muted-foreground">{episode.length}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{episode.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="sticky top-24">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Trailer</h2>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                    <video src={series.trailerUrl} poster={series.trailerPoster} controls className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Related Series */}
            {relatedSeries.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">More Like This</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {relatedSeries.map((s) => (
                    <Link key={s.id} href={`/series/${s.id}`} className="group">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                        <Image
                          src={s.image || "/placeholder.svg"}
                          alt={s.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="mt-2 font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
