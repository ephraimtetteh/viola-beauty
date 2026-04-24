import { Link } from "react-router-dom";
import { images } from "../constants/data";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutComponent = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-linear",
      once: false,
    });
  },[])
  return (
    <>
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 py-20">
        <div data-aos='fade-right'  className="relative shadow-2xl shadow-[#fff8f5] rounded-2xl overflow-hidden shrink-0">
          <img
            className="max-w-md w-full object-cover rounded-2xl"
            src={images.vincentia}
            alt=""
          />
          {/* <a
            href={
              "https://www.instagram.com/violabeautymua?igsh=MWY1aGZiZ3hpbzNvNw=="
            }
            className="flex items-center gap-1 max-w-72 absolute bottom-8 left-8 bg-white p-4 rounded-xl"
          >
            <div className="flex -space-x-4 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="image"
                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-1"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="image"
                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[2]"
              />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                alt="image"
                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[3]"
              />
              <div className="flex items-center justify-center text-xs  text-white size-9 rounded-full border-[3px] border-white bg-[#7c5546] hover:-translate-y-1 transition z-[4]">
                20k
              </div>
            </div>
            <p className="text-sm font-medium text-slate-800">
              Follow us on our social handles
            </p>
          </a> */}
        </div>
        <div className="text-sm text-slate-600 max-w-lg" data-aos='fade-left'>
          <h1 className="text-xl uppercase font-semibold text-slate-700">
            The Artist
          </h1>
          {/* <div className="w-24 h-0.75 rounded-full bg-linear-to-r from-[#fff8f5] to-[#7c5546]"></div> */}
          
          <p className="mt-8">
            Hi! I’m Vincentia Ocloo, founder and creative lead of Viola Beauty,
            a Ghanaian based beauty business.
          </p>
          <p className="mt-4">
            I find joy in glamming people and I love how that, almost
            immediately, helps them find and tap into their inner confidence.
          </p>
          <p className="mt-4">
            No, my name isn’t Viola as many call me. (Haha!) Viola is a name I
            liked and decided to use as my business name, and later found out
            its meaning, flower, aligns with my brand identity of blossoming
            from the inside out.
          </p>
          <Link
            to="/about"
            className="flex items-center w-max gap-2 mt-8 hover:-translate-y-0.5 transition bg-black hover:bg-transparent hover:text-black border border-black py-3 px-8 rounded-full text-white"
          >
            <span>Read more</span>
            {/* <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="black"
              xmlns="http://www.w3.org/2000/svg"

            >
              <path
                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                fill="#fff"
              />
            </svg> */}
          </Link>
        </div>
      </section>
    </>
  );
}


export default AboutComponent