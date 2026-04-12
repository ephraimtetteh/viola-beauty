import React, { useEffect } from 'react'
import { slides } from '../constants/data';
import AOS from 'aos'
import "aos/dist/aos.css";

const WhyUs = () => {
    useEffect(() => {
      AOS.init({
        duration: 2000,
        easing: 'ease-in-out',
        once: false
      })
    }, [])
    return (
      <>
        <div
          data-aos="fade-left"
          data-aos-delay='500'
          className="bg-[#FAFAFA] py-16 px-4 flex flex-col items-center"
        >
          <div className="text-center mb-15">
            <h1 className="text-[40px] font-medium text-slate-900 mb-4">
              Why You'll Love Us
            </h1>
            <p className="text-base text-slate-600 max-w-md leading-relaxed">
              Production-ready AI tools and software designed to speed up your
              workflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 max-w-6xl w-full">
            {slides.map((card, index) => (
              <div
                key={index}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-lg p-4 flex flex-col items-center"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full max-w-56 object-cover mb-6"
                />
                <div className="w-full max-w-56 flex flex-col h-full">
                  <h3 className="text-base font-medium text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    {card.subtitle}
                  </p>
                  <div className="flex items-end justify-end">
                    <a
                      href={card.link}
                      className="inline-flex items-center gap-2 bg-transparent border-0 text-slate-700 text-xs cursor-pointer p-0 hover:gap-2 group"
                    >
                      TRY NOW
                      <svg
                        width="22"
                        height="15"
                        viewBox="0 0 22 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M4.583 7.5h12.834M11 3.125 17.417 7.5 11 11.875"
                          stroke="#314158"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

export default WhyUs