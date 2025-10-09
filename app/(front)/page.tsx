import { ComingSoon } from "@/components/front-end/coming-soon"
import { ContinueWatching } from "@/components/front-end/continue-watching"
import { GenreFilter } from "@/components/front-end/genre-filter"
import { HeroCarousel } from "@/components/front-end/hero-couresel"
import { MovieSection } from "@/components/front-end/movie-section"
import { Pricing } from "@/components/front-end/pricing"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroCarousel />
      <main className="px-4 md:px-12 lg:px-24">
        <div className="px-4 md:px-8 lg:px-12 space-y-12 pb-12">
          <ContinueWatching />
          <GenreFilter />
          <MovieSection title="Trending Now" movies={trendingMovies} />
          <MovieSection title="Action Movies" movies={actionMovies} />
          <MovieSection title="Drama Series" movies={dramaMovies} />
          <MovieSection title="New Releases" movies={newReleases} />
          <ComingSoon movies={comingSoonMovies} />
        </div>
        <Pricing/>
      </main>
    </div>
  )
}

// Sample movie data
const trendingMovies = [
  {
    id: 1,
    title: "Quantum Horizon",
    image: "/p1.png",
    rating: 8.9,
    year: 2024,
    genre: "Sci-Fi",
  },
  {
    id: 2,
    title: "The Last Symphony",
    image: "/p2.png",
    rating: 9.2,
    year: 2024,
    genre: "Drama",
  },
  {
    id: 3,
    title: "Shadow Protocol",
    image: "/02b07f159da41a1e1c775cb7c8d4edfb.jpg",
    rating: 8.5,
    year: 2024,
    genre: "Action",
  },
  {
    id: 4,
    title: "Midnight in Tokyo",
    image: "/3a22f72992ccfbce4f86d0d8da6cef56.jpg",
    rating: 8.7,
    year: 2024,
    genre: "Thriller",
  },
  {
    id: 5,
    title: "The Architect",
    image: "/6ed8865d6712fb9f41c14f11e553bdf3.jpg",
    rating: 8.3,
    year: 2024,
    genre: "Thriller",
  },
]

const actionMovies = [
  {
    id: 6,
    title: "Steel Thunder",
    image: "/71u4ibuAdsL._AC_SL1500_.jpg",
    rating: 8.1,
    year: 2024,
    genre: "Action",
  },
  {
    id: 7,
    title: "Velocity",
    image: "/71uUHp9a3bL._AC_SL1000_.jpg",
    rating: 7.9,
    year: 2024,
    genre: "Action",
  },
  {
    id: 8,
    title: "Phoenix Rising",
    image: "/422fde98670645.5ee1eef1b1ae1.jpg",
    rating: 8.4,
    year: 2024,
    genre: "Action",
  },
  {
    id: 9,
    title: "Code Red",
    image: "/466897bdb6d108f081c8f66be683134c.jpg",
    rating: 8.0,
    year: 2024,
    genre: "Action",
  },
  {
    id: 10,
    title: "Titan Force",
    image: "/Art_Poster_-_Sicario_-_Tallenge_Hollywood_Collection_183db2c1-dfb3-4914-9744-12cc8257baa4.jpg",
    rating: 7.8,
    year: 2024,
    genre: "Action",
  },
]

const dramaMovies = [
  {
    id: 11,
    title: "Echoes of Tomorrow",
    image: "/f9c146ad4aa421ada0e48a80797cce91.jpg",
    rating: 9.0,
    year: 2024,
    genre: "Drama",
  },
  {
    id: 12,
    title: "The Painter's Dream",
    image: "/images (3).jpg",
    rating: 8.8,
    year: 2024,
    genre: "Drama",
  },
  {
    id: 13,
    title: "Broken Strings",
    image: "/a.jpg",
    rating: 8.6,
    year: 2024,
    genre: "Drama",
  },
  {
    id: 14,
    title: "Silent Waters",
    image: "/aa.jpg",
    rating: 8.9,
    year: 2024,
    genre: "Drama",
  },
  {
    id: 15,
    title: "The Garden",
    image: "/aed2c6501ec3d1e72c080b75aaa649dd.jpg",
    rating: 8.7,
    year: 2024,
    genre: "Drama",
  },
]

const newReleases = [
  {
    id: 16,
    title: "Neon Dreams",
    image: "/Art_Poster_-_Sicario_-_Tallenge_Hollywood_Collection_183db2c1-dfb3-4914-9744-12cc8257baa4.jpg",
    rating: 8.2,
    year: 2024,
    genre: "Sci-Fi",
  },
  {
    id: 17,
    title: "The Heist",
    image: "/as.jpg",
    rating: 8.5,
    year: 2024,
    genre: "Crime",
  },
  {
    id: 18,
    title: "Starbound",
    image: "/ebf0490caa4b9f95add0258635b99a29.jpg",
    rating: 8.3,
    year: 2024,
    genre: "Adventure",
  },
  {
    id: 19,
    title: "The Detective",
    image: "/aw.jpg",
    rating: 8.6,
    year: 2024,
    genre: "Mystery",
  },
  {
    id: 20,
    title: "Wild Hearts",
    image: "/76181bbbd1a16675fb33da760b9c82dd.jpg",
    rating: 8.1,
    year: 2024,
    genre: "Romance",
  },
]

const comingSoonMovies = [
  {
    id: 21,
    title: "Eternal Nexus",
    image: "/nex.png",
    releaseDate: "Oct 15, 2025",
    genre: "Sci-Fi",
    description:
      "A mind-bending journey through parallel dimensions where reality itself becomes the ultimate battleground.",
  },
  {
    id: 22,
    title: "The Last Guardian",
    image: "/guardian.png",
    releaseDate: "Nov 3, 2025",
    genre: "Fantasy",
    description:
      "An ancient protector awakens to defend humanity against an otherworldly threat in this epic fantasy adventure.",
  },
  {
    id: 23,
    title: "Crimson Tide Rising",
    image: "/crimson.png",
    releaseDate: "Dec 20, 2025",
    genre: "Action",
    description: "A high-stakes naval thriller where a rogue submarine captain must prevent a global catastrophe.",
  },
]

