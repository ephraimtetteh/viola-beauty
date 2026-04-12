import AOS from 'aos';
import React, { useEffect } from 'react'

const Hero = ({image, title, className, tagline, subline}) => {

  useEffect(() => {
    AOS.init({
      duration: 5000,
      easing: "ease-linear",
      once: false,
    })
  },[])

  return (
    <div>
      <div
        className={`${className} h-screen w-full bg-cover bg-position-[center_30%] `}
        style={{ backgroundImage: `url(${image})` }}
        data-aos="zoom-in"
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black/50"></div> */}

        {/* Content */}

        <div className={`${className} relative z-10 flex h-full flex-col items-center justify-center text-center text-white/80 px-6`}>
          <h3 className="text-[20px] font-bold tracking-wide">
            {title}
          </h3>
          <p>{tagline}</p>
          <p>{subline}</p>
        </div>
      </div>
    </div>
  );
}

export default Hero