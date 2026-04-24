import { useState, useEffect, useRef, useCallback } from "react";
import { cardData } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";

// ── Touch/drag threshold ──
const DRAG_THRESHOLD = 50;

export default function CTAgallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);
  const [dragStart, setDragStart] = useState(null);
  const marqueeRef = useRef(null);
  const touchStartX = useRef(null);

  // ── Pause marquee on hover ──
  const pause = () => setIsScrolling(false);
  const resume = () => setIsScrolling(true);

  // ── Open lightbox ──
  const open = useCallback((index) => {
    setActiveIndex(index % cardData.length);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  // ── Close lightbox ──
  const close = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  // ── Navigate ──
  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + cardData.length) % cardData.length),
    [],
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % cardData.length),
    [],
  );

  // ── Keyboard navigation ──
  useEffect(() => {
    if (!lightboxOpen) return;
    const handle = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [lightboxOpen, prev, next, close]);

  // ── Touch swipe in lightbox ──
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > DRAG_THRESHOLD) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <>
      <section className="w-full py-20 overflow-hidden">
        {/* ── Section header ── */}
        <div className="text-center mb-16 px-4">
          <p
            className="text-xs tracking-[5px] uppercase text-[#d4b86a]
            font-medium mb-3"
          >
            Portfolio
          </p>
          <h2
            className="text-4xl sm:text-5xl font-semibold text-[#1a1a1a]
            leading-tight"
          >
            Our Works
          </h2>
          {/* <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-[#e8d9cc]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]" />
            <div className="h-px w-12 bg-[#e8d9cc]" />
          </div> */}
        </div>

        {/* ── Mobile: horizontal scroll strip ── */}
        <div
          className="flex md:hidden overflow-x-auto gap-3 px-4 pb-4
          snap-x snap-mandatory scrollbar-hide"
        >
          {cardData.map((card, i) => (
            <button
              key={i}
              onClick={() => open(i)}
              className="min-w-[78vw] snap-center relative rounded-2xl
                overflow-hidden flex-shrink-0 group"
              style={{ height: "100vw" }}
            >
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform
  duration-700 group-active:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/40
                via-transparent to-transparent opacity-0 group-active:opacity-100
                transition-opacity duration-300"
              />
            </button>
          ))}
        </div>

        {/* ── Desktop: infinite marquee ── */}
        <div
          className="hidden md:block relative"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {/* Left fade */}
          <div
            className="absolute left-0 top-0 h-full w-32 z-10
            pointer-events-none
            bg-gradient-to-r from-white to-transparent"
          />

          {/* Scrolling track */}
          <div className="overflow-hidden">
            <div
              ref={marqueeRef}
              className="flex"
              style={{
                animation: `marqueeScroll ${cardData.length * 3.2}s linear infinite`,
                animationPlayState: isScrolling ? "running" : "paused",
                width: "fit-content",
              }}
            >
              {[...cardData, ...cardData].map((card, i) => (
                <button
                  key={i}
                  onClick={() => open(i)}
                  className="group relative flex-shrink-0 mx-3 rounded-2xl
                    overflow-hidden focus:outline-none"
                  style={{ width: 340, height: 480 }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform
                      duration-700 will-change-transform
                      group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 bg-black/0
                    group-hover:bg-black/20 transition-colors duration-500"
                  />
                  {/* View indicator */}
                  <div
                    className="absolute inset-0 flex items-center
                    justify-center opacity-0 group-hover:opacity-100
                    transition-opacity duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-full bg-white/90
                      flex items-center justify-center shadow-lg"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                        <path d="M11 8v6M8 11h6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right fade */}
          <div
            className="absolute right-0 top-0 h-full w-32 z-10
            pointer-events-none
            bg-gradient-to-l from-white to-transparent"
          />
        </div>

        {/* ── Bottom CTA ── */}
        <div className="text-center mt-12">
          <a
            href="/our-works"
            className="inline-block px-8 py-3 rounded-full border
              border-[#1a1a1a] text-[#1a1a1a] text-sm hover:bg-black
              hover:text-white transition-all duration-300"
          >
            View Full Portfolio
          </a>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-6 py-5
              flex-shrink-0"
            >
              <div>
                <p
                  className="text-[#d4b86a] text-[10px] tracking-[4px]
                  uppercase"
                >
                  Viola Beauty
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  {activeIndex + 1} / {cardData.length}
                </p>
              </div>
              <button
                onClick={close}
                className="w-10 h-10 rounded-full border border-white/20
                  flex items-center justify-center text-white/70
                  hover:text-white hover:border-white/40 transition"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>

            {/* Main image */}
            <div
              className="flex-1 flex items-center justify-center
              px-4 relative min-h-0"
            >
              {/* Prev */}
              <button
                onClick={prev}
                className="absolute left-4 md:left-8 z-10 w-10 h-10
                  rounded-full border border-white/20 flex items-center
                  justify-center text-white/70 hover:text-white
                  hover:border-white/50 transition"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M10 3L5 8l5 5" />
                </svg>
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex items-center justify-center w-full h-full"
                >
                  <img
                    src={cardData[activeIndex]?.image}
                    alt={cardData[activeIndex]?.title}
                    className="max-h-full max-w-full object-contain
                      rounded-xl shadow-2xl"
                    style={{ maxHeight: "calc(100vh - 260px)" }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next */}
              <button
                onClick={next}
                className="absolute right-4 md:right-8 z-10 w-10 h-10
                  rounded-full border border-white/20 flex items-center
                  justify-center text-white/70 hover:text-white
                  hover:border-white/50 transition"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex-shrink-0 px-6 py-5">
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide
                justify-center"
              >
                {cardData.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden
                      transition-all duration-200 ${
                        i === activeIndex
                          ? "ring-2 ring-[#d4b86a] ring-offset-2 ring-offset-black opacity-100"
                          : "opacity-40 hover:opacity-70"
                      }`}
                    style={{ width: 52, height: 52 }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Marquee keyframe ── */}
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
