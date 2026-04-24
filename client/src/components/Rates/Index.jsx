import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { rateImages } from "../../constants/data";
import PaymentDetails from "./Payments";
import TermsAndConditions from "./TermsAndConditions";
import AdditionalServices from "./AdditionalService";
import April from "./April";
import September from "./September";
import HalfDayFullDay from "./Day";
import RateCourses from "./RateCourses";
import RateClases from "./RateClasses";
import GlamServices from "./Glam/Index";
import EssentialsServices from "./Glam/PortriatGlam";
import StudioServices from "./Glam/Studio";

const Rates = () => {
    const [activeSection, setActiveSection] = useState("Bridal");
  
    const sectionImages = {
      Bridal: rateImages,
      Courses: rateImages,
      "Glam Sessions": rateImages,
    };
  
    
    const sectionDefaultIndex = {
      Bridal: 13,
      Courses: 14,
      "Glam Sessions": 3,
    };
  
    const [thumbnail, setThumbnail] = useState(rateImages[0]);
  
    useEffect(() => {
      setThumbnail(sectionImages[activeSection][sectionDefaultIndex[activeSection]]);
    }, [activeSection]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-linear",
      once: false,
    });
  }, []);

  return (
    <div className="relative px-4 md:px-8 lg:px-16 py-16 max-w-7xl mx-auto">
      {/* ================= HERO ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT TEXT */}
          <div className="text-center lg:text-left space-y-6">
            <h3 className="text-sm sm:text-base tracking-widest text-[#d4b86a] uppercase">
              Viola Beauty
            </h3>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
              The{" "}
              <span className="text-[#d4b86a] break-words">
                {activeSection}
              </span>{" "}
              Experience
            </h1>

            {/* <p className="text-gray-500 max-w-md mx-auto lg:mx-0 text-sm sm:text-base">
              2026
            </p> */}
          </div>

          {/* RIGHT IMAGE */}
          <div className="space-y-4 w-full min-w-0">
            {/* MAIN IMAGE */}
            <div className="rounded-2xl overflow-hidden shadow-xl w-full">
              <img
                src={thumbnail}
                alt="Selected"
                className="w-full h-[450px] sm:h-[780px] lg:h-[600px] object-cover transition duration-500 hover:scale-105"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto pb-2 w-full">
              {Array.isArray(sectionImages[activeSection]) &&
                sectionImages[activeSection].map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className={`flex-shrink-0 w-[70px] h-[70px] rounded-lg overflow-hidden border transition ${
                      thumbnail === image
                        ? "border-amber-500 scale-105"
                        : "border-gray-300 hover:scale-105"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BRIDAL SECTION ================= */}
      {activeSection === "Bridal" && (
        <div className="mt-20 space-y-16">
          {/* INTRO */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold text-[#7c5546] capitalize">
              hey girl hey!
            </h2>

            <p className="text-gray-600 text-justify">
              Congratulations on your engagement and thank you for considering
              us for your big day. We’re excited to bring you THE EXPERIENCE.
            </p>

            <p className="text-gray-600 text-justify">
              Here at Viola Beauty, we believe that your 'getting ready'
              experience should be as much of a party and a celebration as your
              reception or afterparty! All we hope to do is to get you to look
              and feel good before we send you off to the love of your life. No
              nerves, just a couple butterflies!
            </p>

            <p className="text-gray-600 text-justify">
              Carefully choose the package that suits your personality and needs
              best. Once you've found it, chileeee let's glam!
            </p>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold text-[#7c5546] capitalize">
              something to remember
            </h2>

            <p className="text-gray-600 text-center text-2xl ">
              " True beauty is on the inside. When wearing your makeup, remember
              to wear your personality and who you truly are "
            </p>
            <p className="text-[#d4b86a] text-end ">
              Viola's Secrets
            </p>
          </div>

          {/* FEATURES */}
          {/* <div className="space-y-16">
            {infos.map((info, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-10 items-center ${
                  index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <img
                  src={info.image}
                  alt=""
                  className="rounded-2xl shadow-lg"
                />

                <div className="space-y-4">
                  <p className="text-sm text-gray-400">0{index + 1}</p>

                  <h3 className="text-2xl font-semibold">{info.title}</h3>

                  <p className="text-gray-600 leading-relaxed">
                    {info.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div> */}

          <April />
          <September />
          <HalfDayFullDay />
          <AdditionalServices />
        </div>
      )}

      {activeSection === "Courses" && (
        <div>
          <RateCourses />
          <RateClases />
        </div>
      )}

      {activeSection === "Glam Sessions" && (
        <div>
          <GlamServices />
          <EssentialsServices />
          <StudioServices />
        </div>
      )}

      {/* ================= FLOATING NAV ================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white/40 backdrop-blur-xl shadow-lg rounded-full px-3 py-2">
        {["Bridal", "Courses", "Glam Sessions"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setActiveSection(item);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-4 py-2 rounded-full text-sm transition ${
              activeSection === item
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {activeSection !== "Glam Sessions" && activeSection !== "Courses" && <TermsAndConditions />}
      <PaymentDetails />
    </div>
  );
};

export default Rates;
