import React from "react";

export default function noVideo() {
  return (
    <div className="text-gray-400 py-10 text-center">
      <p>
        No video series found. Make sure your videos are organized correctly.
      </p>
      <p className="mt-2 text-sm">
        Expected folder structure: /video/[series name]/[video files]
      </p>
      <p className="mt-2 text-sm">
        For thumbnails, add an image file named "t.jpg" (or t.png, etc.) in each
        series folder.
      </p>
    </div>
  );
}
