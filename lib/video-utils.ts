import fs from "fs/promises";
import path from "path";
import type { VideoSeries, Episode } from "./types";

const VIDEO_DIR = path.join(process.cwd(), "video");

const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".webm", ".ts"];

// Supported image extensions for thumbnails
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export async function getVideoSeries(): Promise<VideoSeries[]> {
  try {
    // Check if the directory exists
    try {
      await fs.access(VIDEO_DIR);
    } catch (error) {
      console.error(`Directory ${VIDEO_DIR} does not exist:`, error);
      return [];
    }

    // Get all items in the directory
    const items = await fs.readdir(VIDEO_DIR);

    // Filter for directories (series)
    const seriesDirs = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(VIDEO_DIR, item);
        try {
          const stats = await fs.stat(itemPath);
          return stats.isDirectory() ? item : null;
        } catch (error) {
          console.error(`Error checking if ${itemPath} is a directory:`, error);
          return null;
        }
      })
    );

    // Process each series directory
    const series = await Promise.all(
      seriesDirs.filter(Boolean).map(async (dirName) => {
        if (!dirName) return null;

        const seriesPath = path.join(VIDEO_DIR, dirName);
        let seriesFiles;

        try {
          seriesFiles = await fs.readdir(seriesPath);
        } catch (error) {
          console.error(`Error reading directory ${seriesPath}:`, error);
          return null;
        }

        // Filter for video files
        const videoFiles = seriesFiles.filter((file) =>
          VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase())
        );

        if (videoFiles.length === 0) {
          return null;
        }

        // Look for thumbnail file named "t" with any supported image extension
        let thumbnailPath = null;
        for (const ext of IMAGE_EXTENSIONS) {
          const thumbName = `t${ext}`;
          if (seriesFiles.includes(thumbName)) {
            thumbnailPath = path.join(seriesPath, thumbName);
            break;
          }
        }

        // Extract series title from directory name
        const seriesTitle = dirName;

        // Create episodes from video files
        const episodes = videoFiles.map((file, index) => {
          const episodeId = Buffer.from(`${dirName}-${file}`).toString(
            "base64url"
          );
          // Use the filename without extension as the episode title
          const episodeTitle = path.basename(file, path.extname(file));

          return {
            id: episodeId,
            seriesId: Buffer.from(dirName).toString("base64url"),
            number: index + 1,
            title: episodeTitle,
            path: path.join(seriesPath, file),
            duration: 0, // We'll estimate this in the API
          };
        });

        return {
          id: Buffer.from(dirName).toString("base64url"),
          title: seriesTitle,
          path: seriesPath,
          thumbnail: thumbnailPath,
          episodeCount: episodes.length,
          episodes,
        };
      })
    );

    return series.filter(Boolean) as VideoSeries[];
  } catch (error) {
    console.error("Error reading video directory:", error);
    return [];
  }
}

export async function getSeriesById(id: string): Promise<VideoSeries | null> {
  const allSeries = await getVideoSeries();
  return allSeries.find((series) => series.id === id) || null;
}

export async function getEpisodeById(
  seriesId: string,
  episodeId: string
): Promise<Episode | null> {
  const series = await getSeriesById(seriesId);
  if (!series) return null;

  return series.episodes.find((episode) => episode.id === episodeId) || null;
}
