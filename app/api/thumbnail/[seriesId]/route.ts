import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSeriesById } from "@/lib/video-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { seriesId: string } }
) {
  try {
    const series = await getSeriesById(params.seriesId);

    if (!series || series.episodes.length === 0) {
      return new NextResponse("Series not found", { status: 404 });
    }

    // Check if we have a thumbnail file
    if (series.thumbnail) {
      try {
        // Check if the file exists
        fs.accessSync(series.thumbnail);

        // Get the file extension to determine content type
        const ext = path.extname(series.thumbnail).toLowerCase();
        let contentType = "image/jpeg"; // Default

        switch (ext) {
          case ".png":
            contentType = "image/png";
            break;
          case ".gif":
            contentType = "image/gif";
            break;
          case ".webp":
            contentType = "image/webp";
            break;
          case ".jpg":
          case ".jpeg":
          default:
            contentType = "image/jpeg";
            break;
        }

        // Stream the thumbnail file
        const file = fs.createReadStream(series.thumbnail);
        return new NextResponse(file as unknown as ReadableStream, {
          status: 200,
          headers: {
            "Content-Type": contentType,
          },
        });
      } catch (error) {
        console.error(
          `Error accessing thumbnail file ${series.thumbnail}:`,
          error
        );
        // Fall back to generated thumbnail if file access fails
      }
    }

    // If no thumbnail file or error accessing it, generate a placeholder
    // Generate a color based on the series ID
    const hash = series.id.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const r = Math.abs(hash) % 200; // Keep it darker for better text contrast
    const g = Math.abs(hash >> 8) % 200;
    const b = Math.abs(hash >> 16) % 200;

    // Create a simple SVG with the series title
    const svg = `
      <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="225" fill="rgb(${r},${g},${b})" />
        <text x="200" y="112.5" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${series.title}
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } catch (error) {
    console.error("Error serving thumbnail:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
