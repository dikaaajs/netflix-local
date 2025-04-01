import type { VideoSeries } from "./types"

// Generate dummy series data
export const dummySeries: VideoSeries[] = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    path: "/dummy/stranger-things",
    thumbnail: "/api/thumbnail/stranger-things",
    episodeCount: 8,
    episodes: [
      {
        id: "stranger-things-s01e01",
        seriesId: "stranger-things",
        number: 1,
        title: "Chapter One: The Vanishing of Will Byers",
        path: "/dummy/stranger-things/s01e01.mp4",
        duration: 3600, // 1 hour
      },
      {
        id: "stranger-things-s01e02",
        seriesId: "stranger-things",
        number: 2,
        title: "Chapter Two: The Weirdo on Maple Street",
        path: "/dummy/stranger-things/s01e02.mp4",
        duration: 3000, // 50 minutes
      },
      {
        id: "stranger-things-s01e03",
        seriesId: "stranger-things",
        number: 3,
        title: "Chapter Three: Holly, Jolly",
        path: "/dummy/stranger-things/s01e03.mp4",
        duration: 3300, // 55 minutes
      },
      {
        id: "stranger-things-s01e04",
        seriesId: "stranger-things",
        number: 4,
        title: "Chapter Four: The Body",
        path: "/dummy/stranger-things/s01e04.mp4",
        duration: 3180, // 53 minutes
      },
      {
        id: "stranger-things-s01e05",
        seriesId: "stranger-things",
        number: 5,
        title: "Chapter Five: The Flea and the Acrobat",
        path: "/dummy/stranger-things/s01e05.mp4",
        duration: 3240, // 54 minutes
      },
      {
        id: "stranger-things-s01e06",
        seriesId: "stranger-things",
        number: 6,
        title: "Chapter Six: The Monster",
        path: "/dummy/stranger-things/s01e06.mp4",
        duration: 3120, // 52 minutes
      },
      {
        id: "stranger-things-s01e07",
        seriesId: "stranger-things",
        number: 7,
        title: "Chapter Seven: The Bathtub",
        path: "/dummy/stranger-things/s01e07.mp4",
        duration: 3060, // 51 minutes
      },
      {
        id: "stranger-things-s01e08",
        seriesId: "stranger-things",
        number: 8,
        title: "Chapter Eight: The Upside Down",
        path: "/dummy/stranger-things/s01e08.mp4",
        duration: 3900, // 1 hour 5 minutes
      },
    ],
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    path: "/dummy/breaking-bad",
    thumbnail: "/api/thumbnail/breaking-bad",
    episodeCount: 5,
    episodes: [
      {
        id: "breaking-bad-s01e01",
        seriesId: "breaking-bad",
        number: 1,
        title: "Pilot",
        path: "/dummy/breaking-bad/s01e01.mp4",
        duration: 3600, // 1 hour
      },
      {
        id: "breaking-bad-s01e02",
        seriesId: "breaking-bad",
        number: 2,
        title: "Cat's in the Bag...",
        path: "/dummy/breaking-bad/s01e02.mp4",
        duration: 2940, // 49 minutes
      },
      {
        id: "breaking-bad-s01e03",
        seriesId: "breaking-bad",
        number: 3,
        title: "...And the Bag's in the River",
        path: "/dummy/breaking-bad/s01e03.mp4",
        duration: 3000, // 50 minutes
      },
      {
        id: "breaking-bad-s01e04",
        seriesId: "breaking-bad",
        number: 4,
        title: "Cancer Man",
        path: "/dummy/breaking-bad/s01e04.mp4",
        duration: 2880, // 48 minutes
      },
      {
        id: "breaking-bad-s01e05",
        seriesId: "breaking-bad",
        number: 5,
        title: "Gray Matter",
        path: "/dummy/breaking-bad/s01e05.mp4",
        duration: 3060, // 51 minutes
      },
    ],
  },
  {
    id: "the-witcher",
    title: "The Witcher",
    path: "/dummy/the-witcher",
    thumbnail: "/api/thumbnail/the-witcher",
    episodeCount: 6,
    episodes: [
      {
        id: "the-witcher-s01e01",
        seriesId: "the-witcher",
        number: 1,
        title: "The End's Beginning",
        path: "/dummy/the-witcher/s01e01.mp4",
        duration: 3600, // 1 hour
      },
      {
        id: "the-witcher-s01e02",
        seriesId: "the-witcher",
        number: 2,
        title: "Four Marks",
        path: "/dummy/the-witcher/s01e02.mp4",
        duration: 3600, // 1 hour
      },
      {
        id: "the-witcher-s01e03",
        seriesId: "the-witcher",
        number: 3,
        title: "Betrayer Moon",
        path: "/dummy/the-witcher/s01e03.mp4",
        duration: 3420, // 57 minutes
      },
      {
        id: "the-witcher-s01e04",
        seriesId: "the-witcher",
        number: 4,
        title: "Of Banquets, Bastards and Burials",
        path: "/dummy/the-witcher/s01e04.mp4",
        duration: 3540, // 59 minutes
      },
      {
        id: "the-witcher-s01e05",
        seriesId: "the-witcher",
        number: 5,
        title: "Bottled Appetites",
        path: "/dummy/the-witcher/s01e05.mp4",
        duration: 3300, // 55 minutes
      },
      {
        id: "the-witcher-s01e06",
        seriesId: "the-witcher",
        number: 6,
        title: "Rare Species",
        path: "/dummy/the-witcher/s01e06.mp4",
        duration: 3480, // 58 minutes
      },
    ],
  },
  {
    id: "dark",
    title: "Dark",
    path: "/dummy/dark",
    thumbnail: "/api/thumbnail/dark",
    episodeCount: 4,
    episodes: [
      {
        id: "dark-s01e01",
        seriesId: "dark",
        number: 1,
        title: "Secrets",
        path: "/dummy/dark/s01e01.mp4",
        duration: 3600, // 1 hour
      },
      {
        id: "dark-s01e02",
        seriesId: "dark",
        number: 2,
        title: "Lies",
        path: "/dummy/dark/s01e02.mp4",
        duration: 3300, // 55 minutes
      },
      {
        id: "dark-s01e03",
        seriesId: "dark",
        number: 3,
        title: "Past and Present",
        path: "/dummy/dark/s01e03.mp4",
        duration: 3480, // 58 minutes
      },
      {
        id: "dark-s01e04",
        seriesId: "dark",
        number: 4,
        title: "Double Lives",
        path: "/dummy/dark/s01e04.mp4",
        duration: 3360, // 56 minutes
      },
    ],
  },
  {
    id: "money-heist",
    title: "Money Heist",
    path: "/dummy/money-heist",
    thumbnail: "/api/thumbnail/money-heist",
    episodeCount: 5,
    episodes: [
      {
        id: "money-heist-s01e01",
        seriesId: "money-heist",
        number: 1,
        title: "Episode 1",
        path: "/dummy/money-heist/s01e01.mp4",
        duration: 3000, // 50 minutes
      },
      {
        id: "money-heist-s01e02",
        seriesId: "money-heist",
        number: 2,
        title: "Episode 2",
        path: "/dummy/money-heist/s01e02.mp4",
        duration: 3120, // 52 minutes
      },
      {
        id: "money-heist-s01e03",
        seriesId: "money-heist",
        number: 3,
        title: "Episode 3",
        path: "/dummy/money-heist/s01e03.mp4",
        duration: 3240, // 54 minutes
      },
      {
        id: "money-heist-s01e04",
        seriesId: "money-heist",
        number: 4,
        title: "Episode 4",
        path: "/dummy/money-heist/s01e04.mp4",
        duration: 3180, // 53 minutes
      },
      {
        id: "money-heist-s01e05",
        seriesId: "money-heist",
        number: 5,
        title: "Episode 5",
        path: "/dummy/money-heist/s01e05.mp4",
        duration: 3300, // 55 minutes
      },
    ],
  },
]

