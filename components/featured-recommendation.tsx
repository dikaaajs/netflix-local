"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Info, VolumeX, Volume2 } from "lucide-react";
import type { VideoSeries } from "@/lib/types";

interface FeaturedRecommendationProps {
  series: VideoSeries;
}

export function FeaturedRecommendation({
  series,
}: FeaturedRecommendationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
      // Autoplay when ready
      video.play().catch((err) => {
        console.error("Error autoplaying video:", err);
      });
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  if (!series || series.episodes.length === 0) {
    return null;
  }

  const firstEpisode = series.episodes[0];

  return (
    <div className="relative w-full aspect-square md:aspect-[21/9] overflow-hidden rounded-lg">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black">
        <video
          ref={videoRef}
          src={`/api/video/${series.id}/${firstEpisode.id}`}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          loop
          preload="auto"
          poster={`/api/thumbnail/${series.id}`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 md:via-neutral-950/80 via-neutral-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 md:via-neutral-950/60 via-neutral-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-10">
        <div className="max-w-2xl leading-3">
          <h2 className="text-md md:text-5xl font-bold mb-2 text-white">
            {series.title}
          </h2>
          <p className="text-gray-300 mb-4 text-[.8rem] md:text-base">
            {series.episodeCount} episodes • Featured recommendation
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href={`/watch/${series.id}/${firstEpisode.id}`}
              className="bg-white hover:bg-gray-200 text-black md:px-5 px-3 md:py-2 py-1 text-[.8rem] rounded-md flex items-center gap-2 font-medium transition-colors"
            >
              <Play className="md:w-5 w-3" fill="black" />
              <span>Play</span>
            </Link>

            <Link
              href={`/series/${series.id}`}
              className="bg-gray-600/80 hover:bg-gray-500 text-white md:px-5 px-3 md:py-2 py-1 text-[.8rem] rounded-md flex items-center gap-2 font-medium transition-colors"
            >
              <Info className="md:w-5 w-3" />
              <span>More Info</span>
            </Link>

            <button
              onClick={toggleMute}
              className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {!isVideoReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 bottom-0">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
