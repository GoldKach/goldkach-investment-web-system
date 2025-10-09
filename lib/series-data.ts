export interface Episode {
  id: number
  episodeNumber: number
  title: string
  length: string
  description: string
  videoUrl: string
  poster: string
}

export interface Series {
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
  seasons: number
  episodes: number
  description: string
  director: string
  cast: string[]
  trailerUrl: string
  episodesList: Episode[]
}

export const seriesData: Series[] = [
  {
    id: 1,
    title: "Dark Nexus",
    image: "/series/dark-nexus.jpg",
    poster: "/posters/series/dark-nexus-poster.jpg",
    trailerPoster: "/posters/series/dark-nexus-trailer.jpg",
    rating: 9.1,
    year: 2024,
    genre: "Sci-Fi",
    vj: "VJ Junior",
    views: "5.2M",
    seasons: 2,
    episodes: 16,
    description:
      "In a dystopian future where memories can be extracted and sold, a detective investigates a series of murders linked to a black market memory trade. As she delves deeper, she uncovers a conspiracy that threatens the fabric of reality itself.",
    director: "Lisa Joy",
    cast: ["Evan Rachel Wood", "Jeffrey Wright", "Thandiwe Newton", "Ed Harris"],
    trailerUrl: "/videos/series/dark-nexus-trailer.mp4",
    episodesList: [
      {
        id: 1,
        episodeNumber: 1,
        title: "The Extraction",
        length: "52m",
        description: "A detective discovers a new form of crime in the memory trade.",
        videoUrl: "/videos/series/dark-nexus-s01e01.mp4",
        poster: "/posters/series/dark-nexus-e01.jpg",
      },
      {
        id: 2,
        episodeNumber: 2,
        title: "Fractured Minds",
        length: "48m",
        description: "The investigation leads to a powerful corporation.",
        videoUrl: "/videos/series/dark-nexus-s01e02.mp4",
        poster: "/posters/series/dark-nexus-e02.jpg",
      },
    ],
  },
  {
    id: 2,
    title: "Crown of Thorns",
    image: "/series/crown-thorns.jpg",
    poster: "/posters/series/crown-thorns-poster.jpg",
    trailerPoster: "/posters/series/crown-thorns-trailer.jpg",
    rating: 9.3,
    year: 2023,
    genre: "Drama",
    views: "8.1M",
    seasons: 3,
    episodes: 30,
    description:
      "A historical drama following the rise and fall of a medieval dynasty. Power, betrayal, and ambition collide as families fight for control of the throne in a land torn by war.",
    director: "David Benioff",
    cast: ["Kit Harington", "Emilia Clarke", "Peter Dinklage", "Lena Headey"],
    trailerUrl: "/videos/series/crown-thorns-trailer.mp4",
    episodesList: [
      {
        id: 1,
        episodeNumber: 1,
        title: "Winter's Coming",
        length: "58m",
        description: "The king summons his old friend to serve as his advisor.",
        videoUrl: "/videos/series/crown-thorns-s01e01.mp4",
        poster: "/posters/series/crown-thorns-e01.jpg",
      },
    ],
  },
  {
    id: 3,
    title: "Silicon Valley Nights",
    image: "/series/silicon-valley.jpg",
    poster: "/posters/series/silicon-valley-poster.jpg",
    trailerPoster: "/posters/series/silicon-valley-trailer.jpg",
    rating: 8.7,
    year: 2024,
    genre: "Comedy",
    vj: "VJ Emmy",
    views: "3.9M",
    seasons: 1,
    episodes: 10,
    description:
      "A comedy series following a group of tech entrepreneurs trying to make it big in Silicon Valley. From failed startups to billion-dollar ideas, they navigate the chaotic world of tech innovation.",
    director: "Mike Judge",
    cast: ["Thomas Middleditch", "T.J. Miller", "Josh Brener", "Martin Starr"],
    trailerUrl: "/videos/series/silicon-valley-trailer.mp4",
    episodesList: [
      {
        id: 1,
        episodeNumber: 1,
        title: "Minimum Viable Product",
        length: "28m",
        description: "A programmer creates a revolutionary compression algorithm.",
        videoUrl: "/videos/series/silicon-valley-s01e01.mp4",
        poster: "/posters/series/silicon-valley-e01.jpg",
      },
    ],
  },
  {
    id: 4,
    title: "The Heist",
    image: "/series/the-heist.jpg",
    poster: "/posters/series/the-heist-poster.jpg",
    trailerPoster: "/posters/series/the-heist-trailer.jpg",
    rating: 8.9,
    year: 2024,
    genre: "Thriller",
    vj: "VJ Ice P",
    views: "4.5M",
    seasons: 2,
    episodes: 20,
    description:
      "A master thief assembles a team for the ultimate heist: stealing from the world's most secure vault. But as the plan unfolds, betrayals and unexpected twists threaten to derail everything.",
    director: "Álex Pina",
    cast: ["Álvaro Morte", "Úrsula Corberó", "Itziar Ituño", "Pedro Alonso"],
    trailerUrl: "/videos/series/the-heist-trailer.mp4",
    episodesList: [
      {
        id: 1,
        episodeNumber: 1,
        title: "The Professor",
        length: "47m",
        description: "A criminal mastermind recruits eight thieves for an ambitious heist.",
        videoUrl: "/videos/series/the-heist-s01e01.mp4",
        poster: "/posters/series/the-heist-e01.jpg",
      },
    ],
  },
  {
    id: 5,
    title: "Quantum Detectives",
    image: "/series/quantum-detectives.jpg",
    poster: "/posters/series/quantum-detectives-poster.jpg",
    trailerPoster: "/posters/series/quantum-detectives-trailer.jpg",
    rating: 8.5,
    year: 2023,
    genre: "Sci-Fi",
    views: "2.8M",
    seasons: 1,
    episodes: 12,
    description:
      "Two detectives use quantum technology to solve crimes by viewing alternate timelines. But when they witness a murder that hasn't happened yet, they must prevent it before it's too late.",
    director: "Christopher Nolan",
    cast: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki", "Kenneth Branagh"],
    trailerUrl: "/videos/series/quantum-detectives-trailer.mp4",
    episodesList: [
      {
        id: 1,
        episodeNumber: 1,
        title: "Temporal Anomaly",
        length: "45m",
        description: "Detectives discover they can view alternate timelines.",
        videoUrl: "/videos/series/quantum-detectives-s01e01.mp4",
        poster: "/posters/series/quantum-detectives-e01.jpg",
      },
    ],
  },
  {
    id: 6,
    title: "Medical Frontiers",
    image: "/series/medical-frontiers.jpg",
    poster: "/posters/series/medical-frontiers-poster.jpg",
    trailerPoster: "/posters/series/medical-frontiers-trailer.jpg",
    rating: 8.8,
    year: 2024,
    genre: "Drama",
    vj: "VJ Mark",
    views: "6.3M",
    seasons: 4,
    episodes: 48,
    description:
      "Follow the lives of doctors and nurses at a cutting-edge hospital as they navigate complex medical cases, personal dramas, and ethical dilemmas in their quest to save lives.",
    director: "Shonda Rhimes",
    cast: ["Ellen Pompeo", "Sandra Oh", "Patrick Dempsey", "Katherine Heigl"],
    trailerUrl: "/videos/series/medical-frontiers-trailer.mp4",
    episodesList: [
      {
        id: 1,
        episodeNumber: 1,
        title: "First Day",
        length: "43m",
        description: "New surgical interns begin their first day at the hospital.",
        videoUrl: "/videos/series/medical-frontiers-s01e01.mp4",
        poster: "/posters/series/medical-frontiers-e01.jpg",
      },
    ],
  },
]
