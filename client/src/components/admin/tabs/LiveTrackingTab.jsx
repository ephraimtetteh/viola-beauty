import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Card from "../ui/Card";

const API = import.meta.env.VITE_API_URL;

const PAGE_LABELS = {
  "/": "Home",
  "/book-us": "Rates",
  "/courses": "Education",
  "/our-works": "Portfolio",
  "/about": "About",
  "/about-company": "About Company",
  "/contact-us": "Contact",
  "/class-registration": "Class Registration",
  "/checkout": "Checkout",
};

const label = (page) => PAGE_LABELS[page] || page;

export default function LiveTrackingTab() {
  const [visitors, setVisitors] = useState(0);
  const [feed, setFeed] = useState([]);
  const [pageCounts, setPageCounts] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API, { transports: ["websocket"] });
    const s = socketRef.current;

    s.on("visitor_count", (count) => setVisitors(count));

    s.on("live_activity", (event) => {
      setFeed((prev) => [event, ...prev].slice(0, 50));

      if (event.type === "page_view") {
        setPageCounts((prev) => ({
          ...prev,
          [event.page]: (prev[event.page] || 0) + 1,
        }));
      }
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const maxCount = topPages[0]?.[1] || 1;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Active now */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Active Now
          </p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-semibold text-[#1a1a1a]">{visitors}</p>
            <span className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">live</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Page Views This Session
          </p>
          <p className="text-4xl font-semibold text-[#1a1a1a]">
            {Object.values(pageCounts).reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      {/* Page breakdown */}
      {topPages.length > 0 && (
        <Card>
          <p
            className="text-xs font-semibold text-gray-400 uppercase
            tracking-wider mb-4"
          >
            Pages — This Session
          </p>
          <div className="space-y-3">
            {topPages.map(([page, count]) => (
              <div key={page}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{label(page)}</span>
                  <span className="font-semibold text-[#1a1a1a]">{count}</span>
                </div>
                <div className="h-1.5 bg-[#f0e6dd] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4b86a] rounded-full transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Live feed */}
      <Card>
        <p
          className="text-xs font-semibold text-gray-400 uppercase
          tracking-wider mb-4"
        >
          Live Event Feed
        </p>
        {feed.length > 0 ? (
          <div className="space-y-0 max-h-80 overflow-y-auto">
            {feed.map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-4 py-2.5
                border-b border-[#f0e6dd] last:border-0"
              >
                <span
                  className="text-xs text-[#d4b86a] font-medium
                  flex-shrink-0 w-20 mt-0.5"
                >
                  {event.type === "page_view" ? "Page view" : "Booking"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#1a1a1a]">
                    {event.type === "page_view"
                      ? `Visited ${label(event.page)}`
                      : `Booking ${event.event}${event.category ? ` — ${event.category}` : ""}`}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            Waiting for visitor activity...
          </p>
        )}
      </Card>
    </div>
  );
}
