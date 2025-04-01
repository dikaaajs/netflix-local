"use client";

import Link from "next/link";
import { FeaturedRecommendation } from "@/components/featured-recommendation";
import { useEffect, useState } from "react";
import { VideoSeries } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfiniteScroll from "@/components/infinite-scroll";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";

export default function Home() {
  const [videoSeries, setVideoSeries] = useState<VideoSeries[]>([]);
  const [recommendedSeries, setRecommendedSeries] =
    useState<VideoSeries | null>(null);
  const [parsedGenres, setParsedGenres] = useState<null | []>(null);

  useEffect(() => {
    const fetchVideoSeries = async () => {
      try {
        const resSeries = await fetch("/api/video");
        const series = await resSeries.json();
        setVideoSeries(series);
        // Get a random series for the recommendation
        const getRandomSeries = () => {
          if (series.length === 0) return null;
          const randomIndex = Math.floor(Math.random() * series.length);
          return series[randomIndex];
        };
        const randomSeries = getRandomSeries();
        console.log(randomSeries);
        setRecommendedSeries(randomSeries);
      } catch (error) {
        console.error("Error fetching video series:", error);
      }
    };

    fetchVideoSeries();

    // get genre
    const genres = localStorage.getItem("genres");
    const tmp = genres ? JSON.parse(genres) : null;
    setParsedGenres(tmp);
  }, []);
  console.log(parsedGenres);

  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      <header className="p-4 md:p-6 justify-between flex items-center">
        <div className="text-pink-500 font-satoshi text-center leading-[10px]">
          <h1 className="text-2xl md:text-3xl font-extrabold ">CCC</h1>
          <span className="text-[.8rem]">celap celup clip</span>
        </div>

        <nav className="flex gap-[30px] font-satoshi font-medium items-center">
          <Link href={"https://trakteer.id/dika-ackerman-tdubv?quantity=1"}>
            trakteer
          </Link>
          <UserProfileDropdown allSeries={videoSeries} />
        </nav>
      </header>

      {/* Featured Recommendation Section */}
      {recommendedSeries && (
        <section className="px-4 md:px-6 mb-8">
          <FeaturedRecommendation series={recommendedSeries} />
        </section>
      )}

      {/* my video */}
      <section className="px-4 md:px-6 pb-10 relative">
        {/* Right shadow gradient */}
        <div className="absolute z-50 right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        {/* Left shadow gradient */}
        <div className="absolute z-50 left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>

        <div className="relative">
          <InfiniteScroll series={videoSeries} judul="all anime" />
        </div>
      </section>

      {/* map genre */}
      {parsedGenres &&
        parsedGenres.length > 0 &&
        parsedGenres.map((genre: any) => {
          return (
            <section className="px-4 md:px-6 pb-10 relative" key={genre.name}>
              {/* Right shadow gradient */}
              <div className="absolute z-50 right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
              {/* Left shadow gradient */}
              <div className="absolute z-50 left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>

              <div className="relative">
                <InfiniteScroll series={genre.value} judul={genre.name} />
              </div>
            </section>
          );
        })}
    </main>
  );
}
