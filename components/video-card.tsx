import type { Episode } from "@/lib/types"

interface VideoCardProps {
  episode: Episode
}

export function VideoCard({ episode }: VideoCardProps) {
  return (
    <div className="group flex gap-4 p-3 rounded-md hover:bg-gray-800 transition-colors">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
        <span className="text-2xl font-bold">{episode.number}</span>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="font-medium">{episode.title}</h3>
        <p className="text-sm text-gray-400">{formatDuration(episode.duration)}</p>
      </div>
      <div className="ml-auto flex items-center">
        <span className="bg-white bg-opacity-0 text-transparent group-hover:bg-opacity-90 group-hover:text-black transition-all px-3 py-1 rounded-full text-sm font-medium">
          Play
        </span>
      </div>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

