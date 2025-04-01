import { getVideoSeries } from "@/lib/video-utils";
import GenreManager from "@/components/genre-manager";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function GenresPage() {
  const videoSeries = await getVideoSeries();

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-satoshi">
      <header className="p-4 md:p-6 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </header>

      <GenreManager availableSeries={videoSeries} />
    </main>
  );
}
