import React from "react";
export default function SummaryCard({ summary, videoId }) {
  return (
    <div className="bg-white/40 backdrop-blur p-6 rounded-lg mt-6 shadow-lg">
      {videoId && (
        <img
          src={`http://img.youtube.com/vi/${videoId}/0.jpg`}
          className="mb-4 w-full rounded-md"
          alt="YouTube Thumbnail"
        />
      )}
      <div className="whitespace-pre-line text-lg">{summary}</div>
    </div>
  );
}
