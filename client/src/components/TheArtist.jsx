import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { images } from "../constants/data";

const API = import.meta.env.VITE_API_URL;

const SECTIONS = [
  {
    image: images.about3,
    text: `I remember so vividly how much I looked forward to Sundays because I
got to wear my mum's foundation and lipstick and choose my own clothes for
church. I was about ten years old and I think this was the highlight of my
week after all the bore from school.`,
  },
  {
    image: images.about2,
    text: `In my teenage years, I started trying new makeup products. I would sneak
into my older cousins' makeup bags and experiment with blushes, eyeshadow,
mascaras and liners. By university, I already had a fair idea of makeup and
its application and thankfully, all my close friends did too. We would skip
class to have long hours of glam time only to wipe it all off because we had
nowhere to go.`,
  },
  {
    image: images.about4,
    text: `People all around me loved makeup and that fuelled my interest and love
for it. Some of my friends in school started asking me to do their makeup
after they had seen mine and before I knew it, I had turned what I loved into
a small business. I believe these were the formative years of what is now my
career in beauty and I've been at it ever since.`,
  },
  {
    image: images.about5,
    text: `My greatest desire and hope on this journey is to help you search within
and find the well of beauty inside that is waiting to be unearthed. True
beauty is on the inside — when wearing your makeup, remember to wear your
personality and who you truly are.`,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function TheArtist() {
  const [artistBio, setArtistBio] = useState("");

  // Pull editable bio from admin content settings if set
  useEffect(() => {
    fetch(`${API}/api/settings/about_content`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.artist_bio) setArtistBio(data.artist_bio);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ── Section label ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p
            className="text-xs tracking-[5px] uppercase text-[#d4b86a]
            font-medium mb-4"
          >
            The Artist
          </p>
          <h2
            className="text-4xl sm:text-5xl font-semibold text-[#1a1a1a]
            leading-tight"
          >
            Vincentia Ocloo
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-12 bg-[#e8d9cc]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]" />
            <div className="h-px w-12 bg-[#e8d9cc]" />
          </div>
        </motion.div>

        {/* ── Stacked sections: text → image → text → image ── */}
        <div className="space-y-20">
          {SECTIONS.map((section, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i}>
                {/* Text block */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className={`mb-8 ${isEven ? "pr-0 md:pr-12" : "pl-0 md:pl-12"}`}
                >
                  <p
                    className="text-gray-600 text-base sm:text-lg
                    leading-relaxed text-justify"
                  >
                    {/* Use editable bio for first paragraph if set */}
                    {i === 0 && artistBio ? artistBio : section.text}
                  </p>
                </motion.div>

                {/* Image block */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.97 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.7,
                        ease: "easeOut",
                        delay: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className={`w-full ${
                    isEven ? "md:w-[85%] ml-auto" : "md:w-[85%] mr-auto"
                  }`}
                >
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={section.image}
                      alt={`Viola Beauty — ${i + 1}`}
                      loading="lazy"
                      className="w-full object-cover object-top
                        hover:scale-[1.02] transition-transform duration-700"
                      style={{ maxHeight: 540 }}
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ── Quote ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-24 space-y-3"
        >
          <p
            className="text-xl sm:text-2xl text-[#7c5546] italic
            font-semibold leading-relaxed max-w-xl mx-auto"
          >
            "True beauty is on the inside. When wearing your makeup, remember to
            wear your personality and who you truly are."
          </p>
          <p className="text-sm text-[#d4b86a]">— Viola's Secrets</p>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link
            to="/about-company"
            className="group inline-flex items-center gap-2 px-8 py-3
              rounded-full border border-[#1a1a1a] text-[#1a1a1a] text-sm
              hover:bg-black hover:text-white transition-all duration-300"
          >
            Learn more about the company
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-0.5 transition-transform duration-300"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
