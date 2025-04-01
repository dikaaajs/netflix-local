"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoSeriesCard } from "@/components/video-series-card";
import type { VideoSeries } from "@/lib/types";

interface InfiniteScrollProps {
  series: VideoSeries[];
  judul: string;
}

export default function InfiniteScroll({ series, judul }: InfiniteScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to handle scrolling when buttons are clicked
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const isLaptop = window.innerWidth >= 1024; // Assuming laptop screens are 1024px or wider
    const scrollAmount = isLaptop ? 220 * 5 : 220 * 2; // Scroll 5 cards on laptop, 2 cards otherwise

    let start = container.scrollLeft;
    let end =
      direction === "left" ? start - scrollAmount : start + scrollAmount;
    let startTime: number | null = null;

    function animateScroll(time: number) {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 300, 1); // Durasi 400ms
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Easing ease-out
      container.scrollLeft = start + (end - start) * easeOutProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  };

  // Duplicate the series to create the illusion of infinite content

  return (
    <div className="relative group">
      <div className="absolute w-full h-fit top-0 right-0 z-50 flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">{judul}</h2>

        {/* button */}
        <div className="flex gap-[10px]">
          <button
            onClick={() => scroll("left")}
            className=" bg-white text-black rounded-full p-2 z-20 "
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="bg-white text-black rounded-full p-2 z-40 "
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll xl:overflow-x-hidden overflow-y-visible h-[250px] md:h-[280px] items-end gap-4 pb-4"
        style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
      >
        {series.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 w-[180px] md:w-[220px]"
          >
            <Link href={`/series/${item.id}`}>
              <VideoSeriesCard series={item} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
