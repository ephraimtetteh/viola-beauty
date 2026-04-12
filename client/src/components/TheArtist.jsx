import { useEffect } from "react";
import { images } from "../constants/data";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";


const TheArtist =() => {
    useEffect(() => {
      AOS.init({
        duration: 2000,
        easing: 'ease-in-out',
        once: false
      })
    }, [])
  return (
    <>
      <div className="relative mx-auto max-w-5xl px-4 py-20">
        <div className="absolute -z-50 size-100 -top-10 -left-20 aspect-square rounded-full bg-[#fff8f5] blur-3xl"></div>
        <div>
          <h1
            data-aos="fade-right"
            className="text-xl uppercase font-semibold text-slate-700"
          >
            The Artist
          </h1>
          <p
            data-aos="fade-left"
            className="text-slate-800 text-lg text-justify max-w-5xl my-5"
          >
            I remember so vividly how much I looked forward to Sundays because I
            got to wear my mum’s foundation and lipstick and choose my own
            clothes for church. I was about ten years old and I think this was
            the highlight of my week after all the bore from school.
          </p>

          <p
            data-aos="fade-right"
            className="text-slate-800 text-lg max-w-5xl mb-5 text-justify"
          >
            In my teenage years, I started trying new makeup products. I would
            sneak into my older cousins’ makeup bags and experiment with
            blushes, eyeshadow, mascaras and liners. By university, I already
            had a fair idea of makeup and its application and thankfully, all my
            close friends did too. We would skip class to have long hours of
            glam time only to wipe it all off because we had nowhere to go. (I
            don’t recommend this, do both babe!)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10">
          <div className="md:col-span-2" data-aos="fade-up">
            <img
              alt="features showcase"
              src={images.about3}
              className="rounded hover:-translate-y-0.5 transition duration-300"
            />
            <Link
              to="/about-company"
              className="group flex items-center gap-2 mt-4 text-[#7c5546] hover:text-[#f2d8c6] transition"
            >
              Learn more about the company
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right size-5 group-hover:translate-x-0.5 transition duration-300"
                aria-hidden="true"
              >
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </Link>
          </div>
          <div className="md:col-span-1" data-aos="fade-left">
            <img
              alt="features showcase"
              className="hover:-translate-y-0.5 transition duration-300"
              src={images.about2}
            />

            <h3 className=" text-slate-800 mt-6 text-justify">
              My greatest desire and hope on this journey is to help you search
              within and find the well of beauty inside that is waiting to be
              unearthed.
            </h3>
            <p className="text-slate-600 mt-2 text-justify">
              People all around me loved makeup and that fuelled my interest and
              love for it. Some of my friends in school started asking me to do
              their makeup after they had seen mine and before I knew it, I had
              turned what I loved into a small business. I believe these were
              the formative years of what is now my career in beauty and I’ve
              been at it ever since.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TheArtist