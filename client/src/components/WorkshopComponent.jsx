import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WorkShopHero from "./Workshop/Hero";
import Courses from "./Workshop/Courses";
import Instructor from "./Workshop/Instructor";
import FAQ from "./Workshop/FAQs";
import { images, what, who } from "../constants/data";

const API = import.meta.env.VITE_API_URL;

export default function WorkshopEducation() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/settings/about_content`)
      .then((r) => r.json())
      .then(setContent)
      .catch(console.error);
  }, []);

  return (
    <div className="relative flex flex-col">
      <div
        className="relative flex flex-col px-4 md:px-8 lg:px-16
        items-center w-full"
      >
        {/* Hero */}
        <section
          className="relative w-full h-[90vh] mt-18 rounded-b-2xl
          overflow-hidden"
        >
          <img
            src={images.educationbg3}
            alt="Signature Glam Series"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute inset-0 flex flex-col items-center
            justify-center text-center text-white px-6"
          >
            <h3 className="lg:text-lg tracking-[0.3em] text-[#d4b86a]">
              EDUCATION — ONLINE WORKSHOP
            </h3>
            <h1 className="text-2xl md:text-6xl mb-4 uppercase">
              The Signature Glam Series
            </h1>
            <p className="text-md md:text-lg max-w-xl mb-6 text-white/80">
              Learn at your pace. Master your finish. Show up boldly.
            </p>
            <a
              href="#courses"
              className="px-8 py-3 border border-white hover:bg-white
                hover:text-black transition-all duration-300 rounded-full"
            >
              Explore
            </a>
          </div>
        </section>

        {/* Workshop definition */}
        <section className="max-w-4xl text-center py-24">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">workshop</h2>
          <p className="italic text-black mb-6">/ˈwəːkʃɒp/</p>
          <p className="text-lg text-gray-700 leading-relaxed">
            A structured learning session focused on practical skill-building.
            Workshops are interactive, hands-on experiences designed to help you
            develop a specific skill with intention and clarity.
          </p>
          <p className="mt-6 text-lg font-medium text-gray-900">
            It's not just watching. It's learning by doing.
          </p>
        </section>

        {/* Intro image + text */}
        <section
          className="grid md:grid-cols-2 gap-16 items-center
          max-w-6xl py-16"
        >
          <img
            src={images.educationbg2}
            alt="Workshop preview"
            className="rounded-2xl shadow-xl"
            loading="lazy"
          />
          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              If you've ever admired the soft glam finish Viola Beauty is known
              for, this workshop was created for you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Inside this guided series, Vincentia shares the products,
              techniques, and the artistry behind the finish.
            </p>
            <a
              href="#courses"
              className="px-8 py-3 bg-black text-white rounded-full
                hover:bg-[#7c5546] transition"
            >
              Explore
            </a>
          </div>
        </section>

        <section id="courses">
          <Courses />
        </section>

        {/* Who this is for */}
        <section className="max-w-5xl py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Who This Workshop Is For
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {who.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-3 items-start"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-[#d4b86a] flex-shrink-0" />
                <p className="text-gray-700 text-sm sm:text-base">{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What you'll learn */}
        <section className="max-w-5xl py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {what.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-3 items-start"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-[#d4b86a] flex-shrink-0" />
                <p className="text-gray-700 text-sm sm:text-base">{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What to expect */}
        <section className="max-w-4xl text-center py-24">
          <h2 className="text-3xl font-semibold mb-10">What You Can Expect</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            This series was crafted to feel like spending intentional time
            together — with warmth, patience and creativity.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-gray-700">
            {[
              {
                title: "Step-by-Step Teaching",
                body: "Professionally filmed lessons broken into chapters to guide you through every stage.",
              },
              {
                title: "Learn At Your Pace",
                body: "Watch anytime and revisit lessons whenever you need.",
              },
              {
                title: "Lifetime Access",
                body: "Return to the series whenever you want to refine your craft.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="border border-[#e8d9cc] rounded-2xl p-6"
              >
                <h3 className="font-semibold mb-3">{title}</h3>
                <p className="text-sm">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Instructor />
      <FAQ />
    </div>
  );
}
