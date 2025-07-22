import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "./components/SummaryCard";
import { summarize, register, login, getHistory } from "../../utils/api";

export default function IndexPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [summaryData, setSummaryData] = useState(null);
  const [freeUses, setFreeUses] = useState(3);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getHistory(user.user_id).then((data) => setHistory(data));
    }
  }, [user]);

  const handleSummarize = async () => {
    setLoading(true);
    const res = await summarize(videoUrl, user?.access_token);
    if (res.detail) {
      if (res.detail.includes("limit")) setShowRegister(true);
    } else {
      setSummaryData({ summary: res.summary, videoId: res.video_id });
      if (!user) setFreeUses(freeUses - 1);
      if (user) getHistory(user.user_id).then(setHistory);
    }
    setLoading(false);
  };

  const handleHistorySelect = (item) => {
    setSummaryData({ summary: item.summary, videoId: item.video_id });
  };

  return (
    <div>
      <Navbar />
      {user && (
        <Sidebar history={history} onSelect={handleHistorySelect} />
      )}
      <main className={`pt-28 pb-10 px-6 ${user ? "ml-64" : ""}`}>
        <div className="max-w-2xl mx-auto mt-16 bg-white/10 backdrop-blur p-10 rounded-lg">
          <h1 className="gradient-text text-4xl font-bold leading-snug mb-2">
            Create real-time dashboards without writing code
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-md">
            Lensboard helps teams turn live data into beautiful, customizable dashboards—no devs required. Share insights, not spreadsheets.
          </p>
          <div className="flex items-center mb-5">
            <input
              className="flex-1 bg-white/60 rounded-l-lg p-3"
              type="text"
              value={videoUrl}
              placeholder="Enter YouTube Video Link"
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button
              className="button-primary rounded-l-none"
              onClick={handleSummarize}
              disabled={loading || !videoUrl || (freeUses === 0 && !user)}
            >
              {loading ? "Summarizing..." : "Get Detailed Notes"}
            </button>
          </div>
          {!user && (
            <div className="mb-4 text-gray-500">
              Free uses left: <strong>{freeUses}</strong> / 3
            </div>
          )}
          {showRegister && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
              Please sign up to continue and unlock unlimited transcript summaries and history.
            </div>
          )}
        </div>
        {summaryData && (
          <SummaryCard summary={summaryData.summary} videoId={summaryData.videoId} />
        )}
      </main>
    </div>
  );
}
