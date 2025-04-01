"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
} from "lucide-react";

interface VideoPlayerProps {
  videoPath: string;
}

export function VideoPlayer({ videoPath }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasResumed, setHasResumed] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState<number | null>(null);

  // Generate a unique key for this video in localStorage
  const storageKey = `video-progress-${videoPath
    .split("/")
    .slice(3)
    .join("-")}`;

  // Save progress to localStorage every 5 seconds
  useEffect(() => {
    if (!videoRef.current || currentTime <= 0) return;

    const saveInterval = setInterval(() => {
      if (videoRef.current && videoRef.current.currentTime > 0) {
        // Only save if we've watched more than 5 seconds
        if (videoRef.current.currentTime > 5) {
          // Don't save if we're near the end of the video (last 30 seconds)
          if (duration - videoRef.current.currentTime > 30) {
            localStorage.setItem(
              storageKey,
              videoRef.current.currentTime.toString()
            );
          } else {
            // If near the end, clear the saved progress
            localStorage.removeItem(storageKey);
          }
        }
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [storageKey, currentTime, duration]);

  // Check for saved progress when component mounts
  useEffect(() => {
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      const timeInSeconds = Number.parseFloat(savedTime);
      // Only show resume prompt if there's significant progress (more than 30 seconds)
      if (timeInSeconds > 30) {
        setSavedProgress(timeInSeconds);
        setShowResumePrompt(true);
      }
    }
  }, [storageKey]);

  // Handle resuming from saved position
  const handleResume = () => {
    if (videoRef.current && savedProgress) {
      videoRef.current.currentTime = savedProgress;
      videoRef.current
        .play()
        .catch((err) => console.error("Error playing video:", err));
    }
    setShowResumePrompt(false);
    setHasResumed(true);
  };

  // Handle starting from beginning
  const handleStartOver = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .catch((err) => console.error("Error playing video:", err));
    }
    setShowResumePrompt(false);
    setHasResumed(true);
    // Clear saved progress
    localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Number.parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Number.parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Calculate progress percentage for the progress bar
  const progressPercentage = (currentTime / (duration || 1)) * 100;

  return (
    <div className="relative group w-full h-full">
      <video
        ref={videoRef}
        src={videoPath}
        className="w-full h-full"
        onClick={togglePlay}
        poster={`/api/thumbnail/${videoPath.split("/")[3]}`}
        controls={false}
        // Don't autoplay if we have a resume prompt
        autoPlay={!showResumePrompt && hasResumed}
      />

      {/* Resume watching prompt */}
      {showResumePrompt && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md text-center">
            <h3 className="text-xl font-bold mb-4">Resume Watching?</h3>
            <p className="mb-6">
              You were at {formatTime(savedProgress || 0)} of this video. Would
              you like to resume where you left off?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleResume}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Resume
              </button>
              <button
                onClick={handleStartOver}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #E50914 ${progressPercentage}%, #4B5563 ${progressPercentage}%)`,
          }}
        />

        <div className="flex items-center mt-2">
          <button onClick={togglePlay} className="mr-4">
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>

          <div className="flex items-center mr-4">
            <button onClick={toggleMute} className="mr-2">
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <button onClick={toggleFullscreen} className="ml-auto">
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
