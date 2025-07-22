import { useState } from "react";
import axios from "axios";

function App() {
  const [link, setLink] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    const res = await axios.post("http://localhost:8000/summarize", { youtube_url: link });
    setSummary(res.data.summary);
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold mb-4">🎥 YouTube Video Summarizer</h1>
      <input
        type="text"
        className="p-2 w-full max-w-md rounded text-black"
        placeholder="Paste YouTube video URL..."
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        className="mt-4 px-6 py-2 bg-white text-black rounded shadow"
        onClick={handleSummarize}
      >
        Summarize
      </button>
      {summary && (
        <div className="mt-6 w-full max-w-3xl bg-white bg-opacity-10 p-6 rounded">
          <h2 className="text-2xl font-semibold mb-2">📝 Summary:</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
