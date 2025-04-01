export interface VideoSeries {
  id: string;
  title: string;
  path: string;
  thumbnail?: string | null;
  episodeCount: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  seriesId: string;
  number: number;
  title: string;
  path: string;
  duration: number;
}
