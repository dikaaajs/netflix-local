import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getEpisodeById } from "@/lib/video-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { seriesId: string; episodeId: string } }
) {
  try {
    const episode = await getEpisodeById(params.seriesId, params.episodeId);

    if (!episode) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const videoPath = episode.path;

    // Check if the file exists
    try {
      fs.accessSync(videoPath);
    } catch (error) {
      console.error(`Video file ${videoPath} does not exist:`, error);
      return new NextResponse("Video file not found", { status: 404 });
    }

    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = request.headers.get("range");

    // Get the quality parameter (if any)
    const url = new URL(request.url);
    const quality = url.searchParams.get("quality");
    const isPreview = quality === "preview";

    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = Number.parseInt(parts[0], 10);
      const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      const contentType = getContentType(videoPath);

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize.toString(),
        "Content-Type": contentType,
        // Add cache control for previews to improve performance
        ...(isPreview ? { "Cache-Control": "public, max-age=3600" } : {}),
      };

      return new NextResponse(file as unknown as ReadableStream, {
        status: 206,
        headers,
      });
    } else {
      const contentType = getContentType(videoPath);

      const headers = {
        "Content-Length": fileSize.toString(),
        "Content-Type": contentType,
        // Add cache control for previews to improve performance
        ...(isPreview ? { "Cache-Control": "public, max-age=3600" } : {}),
      };

      const file = fs.createReadStream(videoPath);
      return new NextResponse(file as unknown as ReadableStream, {
        status: 200,
        headers,
      });
    }
  } catch (error) {
    console.error("Error streaming video:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mkv":
      return "video/x-matroska";
    case ".avi":
      return "video/x-msvideo";
    case ".mov":
      return "video/quicktime";
    case ".ts":
      return "video/mp2t"; // MIME type for .ts files
    default:
      return "application/octet-stream";
  }
}
