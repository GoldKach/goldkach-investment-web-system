
import { MovieInfo } from "@/components/front-end/movie-info"
import { MoviePlayer } from "@/components/front-end/movie-player"
import { RelatedMovies } from "@/components/front-end/related-movies"
import { moviesData } from "@/lib/movies-data"
import { notFound } from "next/navigation"

export default async function MovieDetailPage({ params }: {  params: Promise<{ id: string }>; }) {
  const {id} =await params
  const movie = moviesData.find((m) => m.id.toString() === id)

  if (!movie) {
    notFound()
  }

  const relatedMovies = moviesData.filter((m) => m.genre === movie.genre && m.id !== movie.id).slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        <MoviePlayer movie={movie} />
        <div className="px-4 md:px-8 lg:px-12 py-12">
          <MovieInfo movie={movie} />
          <RelatedMovies movies={relatedMovies} />
        </div>
      </main>
    </div>
  )
}
