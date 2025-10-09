export interface Documentary {
  id: number
  title: string
  image: string
  poster: string
  trailerPoster: string
  rating: number
  year: number
  genre: string
  vj?: string
  views: string
  length: string
  description: string
  director: string
  narrator?: string
  trailerUrl: string
  videoUrl: string
}

export const documentariesData: Documentary[] = [
  {
    id: 1,
    title: "Planet Earth: The Future",
    image: "/docs/planet-earth-future.jpg",
    poster: "/posters/docs/planet-earth-poster.jpg",
    trailerPoster: "/posters/docs/planet-earth-trailer.jpg",
    rating: 9.4,
    year: 2024,
    genre: "Nature",
    views: "12.5M",
    length: "1h 48m",
    description:
      "An unprecedented look at how climate change is reshaping our planet. From melting ice caps to thriving ecosystems adapting to new conditions, this documentary explores the future of Earth and what we can do to protect it.",
    director: "David Attenborough",
    narrator: "David Attenborough",
    trailerUrl: "/videos/docs/planet-earth-trailer.mp4",
    videoUrl: "/videos/docs/planet-earth-full.mp4",
  },
  {
    id: 2,
    title: "The Last Tribe",
    image: "/docs/last-tribe.jpg",
    poster: "/posters/docs/last-tribe-poster.jpg",
    trailerPoster: "/posters/docs/last-tribe-trailer.jpg",
    rating: 8.9,
    year: 2023,
    genre: "Culture",
    vj: "VJ Junior",
    views: "4.2M",
    length: "1h 32m",
    description:
      "Journey to the Amazon rainforest to meet one of the last uncontacted tribes on Earth. This intimate documentary explores their way of life, traditions, and the threats they face from the modern world.",
    director: "Werner Herzog",
    narrator: "Werner Herzog",
    trailerUrl: "/videos/docs/last-tribe-trailer.mp4",
    videoUrl: "/videos/docs/last-tribe-full.mp4",
  },
  {
    id: 3,
    title: "Silicon Dreams",
    image: "/docs/silicon-dreams.jpg",
    poster: "/posters/docs/silicon-dreams-poster.jpg",
    trailerPoster: "/posters/docs/silicon-dreams-trailer.jpg",
    rating: 8.7,
    year: 2024,
    genre: "Technology",
    vj: "VJ Emmy",
    views: "6.8M",
    length: "2h 5m",
    description:
      "The untold story of the tech revolution. From garage startups to global empires, this documentary reveals the triumphs, failures, and controversies that shaped Silicon Valley and changed the world forever.",
    director: "Alex Gibney",
    narrator: "Morgan Freeman",
    trailerUrl: "/videos/docs/silicon-dreams-trailer.mp4",
    videoUrl: "/videos/docs/silicon-dreams-full.mp4",
  },
  {
    id: 4,
    title: "Ocean Mysteries",
    image: "/docs/ocean-mysteries.jpg",
    poster: "/posters/docs/ocean-mysteries-poster.jpg",
    trailerPoster: "/posters/docs/ocean-mysteries-trailer.jpg",
    rating: 9.1,
    year: 2024,
    genre: "Nature",
    views: "8.9M",
    length: "1h 55m",
    description:
      "Dive into the deepest parts of the ocean to discover creatures and ecosystems never seen before. Using cutting-edge technology, scientists explore the final frontier on Earth and uncover its secrets.",
    director: "James Cameron",
    narrator: "Sigourney Weaver",
    trailerUrl: "/videos/docs/ocean-mysteries-trailer.mp4",
    videoUrl: "/videos/docs/ocean-mysteries-full.mp4",
  },
  {
    id: 5,
    title: "The Space Race 2.0",
    image: "/docs/space-race.jpg",
    poster: "/posters/docs/space-race-poster.jpg",
    trailerPoster: "/posters/docs/space-race-trailer.jpg",
    rating: 8.8,
    year: 2023,
    genre: "Science",
    vj: "VJ Ice P",
    views: "5.7M",
    length: "2h 12m",
    description:
      "The new era of space exploration has begun. Follow the billionaires, scientists, and dreamers racing to colonize Mars, mine asteroids, and make humanity a multi-planetary species.",
    director: "Ron Howard",
    narrator: "Neil deGrasse Tyson",
    trailerUrl: "/videos/docs/space-race-trailer.mp4",
    videoUrl: "/videos/docs/space-race-full.mp4",
  },
  {
    id: 6,
    title: "Ancient Civilizations",
    image: "/docs/ancient-civilizations.jpg",
    poster: "/posters/docs/ancient-civilizations-poster.jpg",
    trailerPoster: "/posters/docs/ancient-civilizations-trailer.jpg",
    rating: 9.0,
    year: 2024,
    genre: "History",
    views: "7.3M",
    length: "1h 42m",
    description:
      "Uncover the mysteries of ancient civilizations that built wonders we still can't fully explain. From the pyramids of Egypt to the lost city of Atlantis, explore the achievements and enigmas of our ancestors.",
    director: "Ken Burns",
    narrator: "Peter Coyote",
    trailerUrl: "/videos/docs/ancient-civilizations-trailer.mp4",
    videoUrl: "/videos/docs/ancient-civilizations-full.mp4",
  },
]
