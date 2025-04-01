"use client";

import { useState, useRef, useEffect } from "react";
import type { VideoSeries } from "@/lib/types";
import { Play } from "lucide-react";
import { Badge } from "./ui/badge";
import { getGenresForSeries } from "@/lib/get-genre";

interface VideoSeriesCardProps {
  series: VideoSeries;
}

export function VideoSeriesCard({ series }: VideoSeriesCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Only start preview after hovering for a short delay
  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsHovering(true);
    }, 800); // 800ms delay before showing preview
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsHovering(false);
    setIsPreviewReady(false);

    // Reset video when mouse leaves
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Handle video loading events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsPreviewReady(true);
      if (isHovering && video.paused) {
        video
          .play()
          .catch((err) => console.error("Error playing preview:", err));
      }
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [isHovering]);

  // Start playing when hovering and video is ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovering && isPreviewReady) {
      video.play().catch((err) => console.error("Error playing preview:", err));
    } else if (!isHovering) {
      video.pause();
    }
  }, [isHovering, isPreviewReady]);

  return (
    <div
      className="group/card relative overflow-hidden rounded-sm transition-transform duration-300 hover:scale-105 md:hover:scale-110 hover:z-30 bg-neutral-950 hover:bg-neutral-900 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-video relative bg-gray-900 overflow-hidden rounded-sm">
        {/* Thumbnail image (always visible) */}
        <div
          className={`absolute inset-0 bg-gray-800 transition-opacity duration-300 ${
            isHovering && isPreviewReady ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={`/api/thumbnail/${series.id}`}
            alt={series.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Video preview (loads when hovering, shows when ready) */}
        {isHovering && (
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isPreviewReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              ref={videoRef}
              src={
                series.episodes.length > 0
                  ? `/api/video/${series.id}/${series.episodes[0].id}`
                  : ""
              }
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          </div>
        )}

        {/* Episode count overlay - only visible on hover */}
        <div
          className={`absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          {series.episodeCount} eps
        </div>
      </div>

      <div
        className={`p-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
      >
        {getGenresForSeries(series.id).map((genre: any) => (
          <Badge
            key={genre}
            variant={"default"}
            className="!text-[.7rem] bg-pink-800/40 rounded-md mr-1"
          >
            {genre}
          </Badge>
        ))}
        <Badge
          variant={"default"}
          className="!text-[.7rem] bg-pink-800/40 rounded-md mr-1"
        >
          video
        </Badge>

        <h3 className="font-bold text-lg font-satoshi">{series.title}</h3>
      </div>
    </div>
  );
}
