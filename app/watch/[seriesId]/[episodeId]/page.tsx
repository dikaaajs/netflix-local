import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSeriesById } from "@/lib/video-utils";
import { VideoPlayer } from "@/components/video-player";
import { notFound } from "next/navigation";

interface WatchPageProps {
  params: {
    seriesId: string;
    episodeId: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const series = await getSeriesById(params.seriesId);

  if (!series) {
    notFound();
  }

  const episode = series.episodes.find((ep) => ep.id === params.episodeId);

  if (!episode) {
    notFound();
  }

  console.log(episode);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4">
        {/* nav */}
        <Link
          href={`/series/${params.seriesId}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to {series.title}</span>
        </Link>

        {/* video player */}
        <div className="aspect-video bg-gray-900 mb-4 rounded-md overflow-hidden">
          <VideoPlayer
            videoPath={`/api/video/${params.seriesId}/${params.episodeId}`}
          />
        </div>

        {/* information */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{episode.title}</h1>
          <p className="text-gray-400">
            {series.title} • Episode {episode.number} •{" "}
            {formatDuration(episode.duration)}
          </p>
        </div>
      </div>
    </main>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
