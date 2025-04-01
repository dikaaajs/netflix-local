"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  FolderHeart,
  ListFilter,
  Clock,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { VideoSeries } from "@/lib/types";

type Genre = {
  name: string;
  value: VideoSeries[];
};

interface UserProfileDropdownProps {
  allSeries: VideoSeries[];
}

export function UserProfileDropdown({ allSeries }: UserProfileDropdownProps) {
  const [genres, setGenres] = useState<Genre[]>([]);

  // Load genres from localStorage
  useEffect(() => {
    const savedGenres = localStorage.getItem("genres");
    if (savedGenres) {
      setGenres(JSON.parse(savedGenres));
    }
  }, []);

  // Calculate total episodes across all series
  const totalEpisodes = allSeries.reduce(
    (total, series) => total + series.episodeCount,
    0
  );

  // Calculate total duration of all videos (in hours)
  const totalDuration =
    allSeries.reduce((total, series) => {
      return (
        total +
        series.episodes.reduce(
          (seriesTotal, episode) => seriesTotal + episode.duration,
          0
        )
      );
    }, 0) / 3600; // Convert seconds to hours

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border-2 border-purple-500 hover:border-purple-400 transition-colors">
          <AvatarImage
            src="https://i.pinimg.com/736x/b9/c1/3b/b9c13beab4f3dc8c6c896ff570fa20ec.jpg"
            alt="User avatar"
          />
          <AvatarFallback className="bg-purple-900 text-purple-200">
            CN
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 bg-gray-900 border border-gray-800 text-white p-0 mr-4">
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <Avatar className="h-12 w-12 border-2 border-purple-500">
            <AvatarImage
              src="https://i.pinimg.com/736x/b9/c1/3b/b9c13beab4f3dc8c6c896ff570fa20ec.jpg"
              alt="User avatar"
            />
            <AvatarFallback className="bg-purple-900 text-purple-200">
              CN
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Yoai</p>
            <p className="text-sm text-gray-400">Barang siapa barang gwejh</p>
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <DropdownMenuLabel className="text-gray-400 text-xs font-normal mb-3 pl-0">
            LIBRARY STATISTICS
          </DropdownMenuLabel>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-blue-900/30 flex items-center justify-center text-blue-400">
                <Film size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Total Series</p>
                <p className="text-xs text-gray-400">
                  {allSeries.length} series
                </p>
              </div>
              <div className="text-xl font-semibold text-blue-400">
                {allSeries.length}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-green-900/30 flex items-center justify-center text-green-400">
                <ListFilter size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Total Episodes</p>
                <p className="text-xs text-gray-400">Across all series</p>
              </div>
              <div className="text-xl font-semibold text-green-400">
                {totalEpisodes}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-amber-900/30 flex items-center justify-center text-amber-400">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Watch Time</p>
                <p className="text-xs text-gray-400">
                  Estimated total duration
                </p>
              </div>
              <div className="text-xl font-semibold text-amber-400">
                {totalDuration.toFixed(1)}h
              </div>
            </div>
          </div>
        </div>

        {genres.length > 0 && (
          <div className="p-4 border-b border-gray-800">
            <DropdownMenuLabel className="text-gray-400 text-xs font-normal mb-3 pl-0">
              YOUR GENRES
            </DropdownMenuLabel>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {genres.map((genre) => (
                <div key={genre.name} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-purple-900/30 flex items-center justify-center text-purple-400">
                    <FolderHeart size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{genre.name}</p>
                    <p className="text-xs text-gray-400">
                      {genre.value.length}{" "}
                      {genre.value.length === 1 ? "series" : "series"}
                    </p>
                  </div>
                  <div className="text-xl font-semibold text-purple-400">
                    {genre.value.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-2">
          <Link href="/genres">
            <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={16} />
                <span>Manage Genres</span>
              </div>
              <ChevronRight size={16} />
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator className="bg-gray-800" />

          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-400">
            <LogOut size={16} />
            <span>Exit</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
