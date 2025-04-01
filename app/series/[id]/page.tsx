import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getSeriesById, getVideoSeries } from "@/lib/video-utils"
import { VideoCard } from "@/components/video-card"
import { notFound } from "next/navigation"

interface SeriesPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const series = await getVideoSeries()
  return series.map((s) => ({ id: s.id }))
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const series = await getSeriesById(params.id)

  if (!series) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="p-4 md:p-6 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
      </header>

      <section className="px-4 md:px-6 pb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{series.title}</h1>
        <p className="text-gray-400 mb-6">{series.episodeCount} episodes</p>

        <div className="grid gap-4">
          {series.episodes.map((episode) => (
            <Link key={episode.id} href={`/watch/${series.id}/${episode.id}`}>
              <VideoCard episode={episode} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

