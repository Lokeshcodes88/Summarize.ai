import React from "react";
export default function Sidebar({ history, onSelect }) {
  return (
    <aside className="sidebar w-64 h-screen fixed left-0 top-0 pt-24 px-6">
      <h2 className="text-primary text-lg font-bold mb-6 ml-2">Transcript History</h2>
      <ul className="space-y-3">
        {history.map((item) => (
          <li
            key={item.id}
            className="cursor-pointer bg-white/20 rounded-md px-4 py-3 hover:bg-secondary/10"
            onClick={() => onSelect(item)}
          >
            {item.video_id}
            <div className="truncate text-xs text-gray-400">{item.created_at}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
