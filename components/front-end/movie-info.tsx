// "use client"

// import { useState } from "react"
// import { Star, Eye, HardDrive, Clock, Calendar, Plus, Share2, Download } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

// interface Movie {
//   id: number
//   title: string
//   description: string
//   rating: number
//   year: number
//   genre: string
//   vj?: string
//   views: string
//   size: string
//   length: string
//   director: string
//   cast: string[]
//   trailerUrl: string
// }

// interface MovieInfoProps {
//   movie: Movie
// }

// export function MovieInfo({ movie }: MovieInfoProps) {
//   const [isInList, setIsInList] = useState(false)

//   return (
//     <div className="space-y-8">
//       {/* Title and Actions */}
//       <div className="space-y-4">
//         <div className="flex items-start justify-between">
//           <div className="space-y-2">
//             <h1 className="text-4xl font-bold text-foreground text-balance">{movie.title}</h1>
//             <div className="flex items-center space-x-4 text-muted-foreground">
//               <div className="flex items-center space-x-1">
//                 <Star className="w-5 h-5 fill-primary text-primary" />
//                 <span className="font-semibold text-foreground">{movie.rating}</span>
//               </div>
//               <span>•</span>
//               <span>{movie.year}</span>
//               <span>•</span>
//               <span>{movie.length}</span>
//               <span>•</span>
//               <Badge variant="outline" className="border-primary/20 text-primary">
//                 {movie.genre}
//               </Badge>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center space-x-3">
//           <Button
//             size="lg"
//             onClick={() => setIsInList(!isInList)}
//             variant={isInList ? "outline" : "default"}
//             className={isInList ? "border-primary/20" : "bg-primary hover:bg-primary/90 golden-glow"}
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             {isInList ? "In My List" : "Add to List"}
//           </Button>
//           <Button size="lg" variant="outline" className="border-border bg-transparent">
//             <Share2 className="w-5 h-5 mr-2" />
//             Share
//           </Button>
//           <Button size="lg" variant="outline" className="border-border bg-transparent">
//             <Download className="w-5 h-5 mr-2" />
//             Download
//           </Button>
//         </div>
//       </div>

//       {/* Movie Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-card border border-border rounded-lg p-4 space-y-2">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Eye className="w-4 h-4" />
//             <span className="text-sm">Views</span>
//           </div>
//           <p className="text-2xl font-bold text-foreground">{movie.views}</p>
//         </div>

//         <div className="bg-card border border-border rounded-lg p-4 space-y-2">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <HardDrive className="w-4 h-4" />
//             <span className="text-sm">File Size</span>
//           </div>
//           <p className="text-2xl font-bold text-foreground">{movie.size}</p>
//         </div>

//         <div className="bg-card border border-border rounded-lg p-4 space-y-2">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Clock className="w-4 h-4" />
//             <span className="text-sm">Duration</span>
//           </div>
//           <p className="text-2xl font-bold text-foreground">{movie.length}</p>
//         </div>

//         <div className="bg-card border border-border rounded-lg p-4 space-y-2">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Calendar className="w-4 h-4" />
//             <span className="text-sm">Release Year</span>
//           </div>
//           <p className="text-2xl font-bold text-foreground">{movie.year}</p>
//         </div>
//       </div>

//       {/* Description and Details */}
//       <div className="grid md:grid-cols-3 gap-8">
//         <div className="md:col-span-2 space-y-6">
//           <div>
//             <h2 className="text-2xl font-bold text-foreground mb-3">Synopsis</h2>
//             <p className="text-muted-foreground leading-relaxed text-pretty">{movie.description}</p>
//           </div>

//           {/* Trailer */}
//           <div>
//             <h2 className="text-2xl font-bold text-foreground mb-3">Trailer</h2>
//             <div className="relative aspect-video bg-card rounded-lg overflow-hidden border border-border">
//               <video controls poster={movie.trailerUrl.replace(".mp4", "-poster.jpg")} className="w-full h-full">
//                 <source src={movie.trailerUrl} type="video/mp4" />
//               </video>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-card border border-border rounded-lg p-6 space-y-4">
//             <div>
//               <h3 className="text-sm font-semibold text-muted-foreground mb-2">Director</h3>
//               <p className="text-foreground">{movie.director}</p>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-muted-foreground mb-2">Cast</h3>
//               <div className="space-y-1">
//                 {movie.cast.map((actor, index) => (
//                   <p key={index} className="text-foreground">
//                     {actor}
//                   </p>
//                 ))}
//               </div>
//             </div>

//             {movie.vj && (
//               <div>
//                 <h3 className="text-sm font-semibold text-muted-foreground mb-2">Translated By</h3>
//                 <Badge className="bg-primary/10 text-primary border-primary/20">{movie.vj}</Badge>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Star, Eye, HardDrive, Clock, Calendar, Plus, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: number
  title: string
  description: string
  rating: number
  year: number
  genre: string
  vj?: string
  views: string
  size: string
  length: string
  director: string
  cast: string[]
  trailerUrl: string
  trailerPoster: string
}

interface MovieInfoProps {
  movie: Movie
}

export function MovieInfo({ movie }: MovieInfoProps) {
  const [isInList, setIsInList] = useState(false)

  return (
    <div className="space-y-8">
      {/* Title and Actions */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground text-balance">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{movie.rating}</span>
              </div>
              <span>•</span>
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.length}</span>
              <span>•</span>
              <Badge variant="outline" className="border-primary/20 text-primary">
                {movie.genre}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            size="lg"
            onClick={() => setIsInList(!isInList)}
            variant={isInList ? "outline" : "default"}
            className={isInList ? "border-primary/20" : "bg-primary hover:bg-primary/90 golden-glow"}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isInList ? "In My List" : "Add to List"}
          </Button>
          <Button size="lg" variant="outline" className="border-border bg-transparent">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button size="lg" variant="outline" className="border-border bg-transparent">
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Movie Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Views</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{movie.views}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <HardDrive className="w-4 h-4" />
            <span className="text-sm">File Size</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{movie.size}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Duration</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{movie.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Release Year</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{movie.year}</p>
        </div>
      </div>

      {/* Description and Details */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Synopsis</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">{movie.description}</p>
          </div>

          {/* Trailer */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Trailer</h2>
            <div className="relative aspect-video bg-card rounded-lg overflow-hidden border border-border">
              <video controls poster={movie.trailerPoster} className="w-full h-full">
                <source src={movie.trailerUrl} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Director</h3>
              <p className="text-foreground">{movie.director}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Cast</h3>
              <div className="space-y-1">
                {movie.cast.map((actor, index) => (
                  <p key={index} className="text-foreground">
                    {actor}
                  </p>
                ))}
              </div>
            </div>

            {movie.vj && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Translated By</h3>
                <Badge className="bg-primary/10 text-primary border-primary/20">{movie.vj}</Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
