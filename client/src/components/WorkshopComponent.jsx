import { Link } from "react-router-dom";
import WorkShopHero from "./Workshop/Hero";
import Courses from "./Workshop/Courses";
import Instructor from "./Workshop/Instructor";
import FAQ from "./Workshop/FAQs";
import Bundle from "./Workshop/Bundle";
import { images, what, who } from "../constants/data";
import { motion } from "framer-motion";


export default function WorkshopEducation() {



  return (
    <div className="relative flex flex-col">
      <div className="relative flex flex-col px-4 md:px-8 lg:px-16 items-center w-full">
      <section className="relative w-full h-[90vh] mt-18 rounded-b-2xl overflow-hidden">
        <img
          src={images.educationbg3}
          alt="Signature Glam Series"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
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
            className="px-8 py-3 border border-white hover:bg-white hover:text-black transition-all duration-300 rounded-full"
          >
            Explore
          </a>
        </div>
      </section>
        {/* HERO */}

        {/* WORKSHOP DEFINITION */}
        <section className="max-w-4xl text-center py-24">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">workshop</h2>

          <p className="italic text-black mb-6">/ˈwəːkʃɒp/</p>

          <p className="text-lg text-gray-700 leading-relaxed">
            A structured learning session focused on practical skill-building.
            Workshops are interactive, hands-on experiences designed to help you
            develop a specific skill with intention and clarity.
          </p>

          <p className="mt-6 text-lg font-medium text-gray-900">
            It’s not just watching. It’s learning by doing.
          </p>
        </section>

        {/* INTRO IMAGE + TEXT */}
        <section className="grid md:grid-cols-2 gap-16 items-center max-w-6xl py-16">
          <img
            src={images.educationbg2}
            alt="Workshop preview"
            className="rounded-2xl shadow-xl"
          />

          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              If you’ve ever admired the soft glam finish Viola Beauty is known
              for, this workshop was created for you.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Inside this guided series, Vincentia shares the products,
              techniques, and the artistry behind the finish.
            </p>

            <a
              href="#courses"
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-amber-700 transition"
            >
              Explore
            </a>
          </div>
        </section>

        <section id="courses">
          <Courses />
        </section>

        {/* WHO THIS WORKSHOP IS FOR */}
        <section className="max-w-5xl py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Who This Workshop Is For
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-700">
            {who.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex gap-3 items-start"
              >
                <div className="w-3 h-3 mt-2 rounded-full bg-black" />
                <p className="text-gray-700 text-sm sm:text-base">{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHAT YOU'LL LEARN */}
        <section className="max-w-5xl py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            What You'll Learn
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-700">
            {what.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex gap-3 items-start"
              >
                <div className="w-3 h-3 mt-2 rounded-full bg-black" />
                <p className="text-gray-700 text-sm sm:text-base">{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHAT TO EXPECT */}
        <section className="max-w-4xl text-center py-24">
          <h2 className="text-3xl font-semibold mb-10">What You Can Expect</h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            This series was crafted to feel like spending intentional time
            together — with warmth, patience and creativity. It invites you to
            slow down, create and reconnect with beauty in a meaningful way.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-gray-700">
            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-3">Step-by-Step Teaching</h3>
              <p>
                Professionally filmed lessons broken down into chapters to guide
                you through every stage.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-3">Learn At Your Pace</h3>
              <p>Watch anytime and revisit lessons whenever you need.</p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-3">Lifetime Access</h3>
              <p>
                Return to the series whenever you want to refine your craft.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Instructor />
      <FAQ />
    </div>
  );
}
