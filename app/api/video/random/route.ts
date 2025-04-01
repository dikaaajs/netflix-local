import { getVideoSeries } from "@/lib/video-utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const series = await getVideoSeries();
    return NextResponse.json(series, { status: 200 });
  } catch (error) {
    console.error("Error fetching video series:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
