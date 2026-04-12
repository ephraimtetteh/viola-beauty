import { slides } from "../constants/data";

const Works = () => {
  return (
    <div className="py-24 px-4 md:px-10 lg:px-16">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Our Work
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 mb-4 max-w-lg mx-auto">
        A visual collection of our most recent works 
      </p>

      {/* ─────────────────────────────────────────
          OPTION 1 — 2-column grid
          First image spans full width as hero,
          rest fill in as equal tiles
      ───────────────────────────────────────── */}
      {/* <p className="mt-12 mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500 md:hidden">
        Option 1 — Grid
      </p>
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-xl ${
              i === 0 ? "col-span-2 h-64" : "h-44"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title ?? `work ${i + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div> */}

      {/* ─────────────────────────────────────────
          OPTION 2 — Horizontal scroll
          Swipeable row, each card is 75vw wide
          so you can peek the next one
      ───────────────────────────────────────── */}
      {/* <p className="mt-10 mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500 md:hidden">
        Option 2 — Horizontal scroll
      </p>
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory md:hidden scrollbar-hide">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative shrink-0 w-[75vw] h-56 rounded-xl overflow-hidden snap-start"
          >
            <img
              src={slide.image}
              alt={slide.title ?? `work ${i + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div> */}

      {/* ─────────────────────────────────────────
          OPTION 3 — Vertical stack
          Full-width tall cards stacked top to bottom
      ───────────────────────────────────────── */}
      {/* <p className="mt-10 mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500 md:hidden">
        Option 3 — Vertical stack
      </p> */}
      <div className="flex flex-col gap-4 md:hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative w-full h-64 rounded-xl overflow-hidden"
          >
            <img
              src={slide.image}
              alt={slide.title ?? `work ${i + 1}`}
              className="h-full w-full object-cover object-center"
            />
            {slide.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm font-medium">{slide.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────
          DESKTOP — accordion expand on hover
      ───────────────────────────────────────── */}
      <div className="hidden md:flex items-stretch gap-2 h-[600px] w-full max-w-7xl mt-10 mx-auto">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative group/item flex-1 min-w-[60px] rounded-xl overflow-hidden
                       transition-all duration-500 ease-in-out hover:flex-[4]"
          >
            <img
              src={slide.image}
              alt={slide.title ?? `work ${i + 1}`}
              className="h-full w-full object-cover object-center"
            />
            {slide.title && (
              <div
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent
                              opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
              >
                <p className="text-white text-sm font-medium truncate">
                  {slide.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;
