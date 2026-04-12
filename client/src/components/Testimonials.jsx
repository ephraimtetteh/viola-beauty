import { testimonials } from "../constants/data";

const Testimonials = () => {
  const columns = [
    { start: 0, end: 3, className: "animate-scroll-up-1" },
    { start: 3, end: 6, className: "hidden md:block animate-scroll-up-2" },
    { start: 6, end: 9, className: "hidden lg:block animate-scroll-up-3" },
  ];

  const renderCard = (testimonial, index) => (
    <div
      key={`${testimonial.id}-${index}`}
      className="bg-white border border-[#e8d9cc] rounded-2xl p-6 mb-4 hover:border-[#d4b86a] hover:shadow-lg transition-all duration-300"
    >
      {/* Quote icon in brand gold */}
      <div className="mb-4">
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            stroke="#d4b86a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13.056c.464 0 .91-.131 1.237-.364.329-.234.513-.55.513-.88v-3.73c0-.33-.184-.647-.513-.88C7.91 6.97 7.464 6.838 7 6.838c-.232 0-.455-.066-.619-.182-.164-.117-.256-.275-.256-.44v-.622c0-.33.184-.646.513-.879.328-.233.773-.364 1.237-.364.232 0 .455-.066.619-.182.164-.117.256-.275.256-.44V2.485c0-.165-.092-.323-.256-.44a1.1 1.1 0 0 0-.619-.181c-1.392 0-2.728.393-3.712 1.092-.985.7-1.538 1.649-1.538 2.638v6.218c0 .33.184.646.513.88.328.233.773.364 1.237.364zm9.83 0c.465 0 .91-.131 1.238-.364.328-.234.513-.55.513-.88v-3.73c0-.33-.184-.647-.513-.88-.328-.233-.773-.364-1.237-.364-.232 0-.455-.066-.619-.182-.164-.117-.256-.275-.256-.44v-.622c0-.33.184-.646.512-.879.329-.233.774-.364 1.238-.364.232 0 .454-.066.619-.182.164-.117.256-.275.256-.44V2.485c0-.165-.092-.323-.256-.44a1.1 1.1 0 0 0-.62-.181c-1.391 0-2.727.393-3.711 1.092-.985.7-1.538 1.649-1.538 2.638v6.218c0 .33.184.646.512.88.329.233.774.364 1.238.364z" />
          </g>
        </svg>
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-600 mb-5 leading-relaxed italic">
        "{testimonial.description}"
      </p>

      {/* Gold star rating */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="#d4b86a"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#f0e6dd]">
        {/* <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-9 h-9 rounded-full object-cover border-2 border-[#d4b86a]"
        /> */}
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a]">
            {testimonial.name}
          </p>
          <p className="text-xs text-[#d4b86a]">{testimonial.company}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-[#fff8f5] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-3">
            Client Love
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-4">
            What Our Clients Say
          </h2>
          {/* gold underline */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="h-px w-12 bg-[#d4b86a]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]"></div>
            <div className="h-px w-12 bg-[#d4b86a]"></div>
          </div>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Real experiences from brides, glam clients, and students who trusted
            Viola Beauty for their most important moments.
          </p>
        </div>

        {/* Scrolling columns */}
        <div className="relative w-full overflow-hidden">
          {/* top fade */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#fff8f5] to-transparent z-10 pointer-events-none"></div>
          {/* bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fff8f5] to-transparent z-10 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-150 overflow-hidden">
            {columns.map((col, colIndex) => (
              <div key={colIndex} className={col.className}>
                {[
                  ...testimonials.slice(col.start, col.end),
                  ...testimonials.slice(col.start, col.end),
                ].map((testimonial, index) => renderCard(testimonial, index))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
