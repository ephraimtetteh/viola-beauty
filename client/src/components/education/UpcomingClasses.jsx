import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const TYPE_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  professional: "Professional",
  group: "Group",
};

const ClassCard = ({ cls }) => {
  const navigate = useNavigate();
  const [spots, setSpots] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/classes/${cls._id}/spots`)
      .then((r) => r.json())
      .then(setSpots)
      .catch(console.error);
  }, [cls._id]);

  const isFull = spots?.available === 0;

  return (
    <div
      className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden
      hover:border-[#d4b86a] hover:shadow-sm transition-all duration-300"
    >
      <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
      <div className="p-6 space-y-4">
        {/* Title + type */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-[#1a1a1a] text-lg leading-snug">
            {cls.title}
          </h3>
          <span
            className="text-xs border border-[#e8d9cc] text-gray-500
            px-2.5 py-1 rounded-full flex-shrink-0"
          >
            {TYPE_LABELS[cls.type]}
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          {cls.description}
        </p>

        {/* Details */}
        <div className="space-y-1.5 text-sm">
          {[
            ["Date", cls.date],
            ["Time", cls.time],
            ["Location", cls.location],
            ["Duration", cls.duration],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-400">{k}</span>
              <span className="text-[#1a1a1a]">{v}</span>
            </div>
          ))}
        </div>

        {/* Spots */}
        {spots && (
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-400">Spots available</span>
              <span
                className={`font-medium ${isFull ? "text-red-500" : "text-[#7c5546]"}`}
              >
                {isFull
                  ? "Fully booked"
                  : `${spots.available} of ${spots.total}`}
              </span>
            </div>
            <div className="h-1.5 bg-[#f0e6dd] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4b86a] to-[#7c5546]
                  rounded-full transition-all duration-500"
                style={{ width: `${(spots.taken / spots.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between pt-2
          border-t border-[#f0e6dd]"
        >
          <div>
            <p className="text-lg font-semibold text-[#1a1a1a]">
              GH₵ {(cls.price / 100).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              Deposit: GH₵ {(cls.deposit / 100).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => navigate("/class-registration", { state: { cls } })}
            disabled={isFull}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-black text-white hover:bg-gray-800"
          >
            {isFull ? "Fully Booked" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UpcomingClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/classes`)
      .then((r) => r.json())
      .then(setClasses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div
          className="w-6 h-6 border-2 border-[#d4b86a]/30 border-t-[#d4b86a]
          rounded-full animate-spin mx-auto"
        />
      </div>
    );
  }

  if (!classes.length) return null;

  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p
            className="text-xs tracking-[4px] uppercase text-[#d4b86a]
            font-medium mb-3"
          >
            Upcoming
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Live <span className="text-[#7c5546]">Classes</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-10 bg-[#d4b86a]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]" />
            <div className="h-px w-10 bg-[#d4b86a]" />
          </div>
          <p className="text-sm text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Join one of our upcoming in-person or online classes. Spots are
            limited — secure yours with a deposit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls._id} cls={cls} />
          ))}
        </div>
      </div>
    </section>
  );
}
