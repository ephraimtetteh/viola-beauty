import React, { useEffect } from 'react'
import AOS from 'aos';
import "aos/dist/aos.css";

const Text = ({text, className}) => {
   useEffect(() => {
      AOS.init({
        duration: 2000,
        easing: "ease-linear",
        once: false,
      });
    }, [])
  return (
    <div
      className={`${className} lg:w-[70%] max-sm:text-justify max-sm:px-3 lg:py-40 py-20 lg:text-2xl items-center justify-center flex mx-auto flex-col gap-2`}
      data-aos="fade-left"
    >
      <h3 className="text-center">
        {text}
      </h3>
      <div className="w-24 h-0.75 rounded-full bg-linear-to-r from-[#7c5546] to-[#FFf8f5]"></div>
    </div>
  );
}

export default Text