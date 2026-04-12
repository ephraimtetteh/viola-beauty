import React, { useEffect } from 'react'
import { infos } from '../constants/data'
import cn from 'clsx'
import AOS from 'aos'
import "aos/dist/aos.css";

const TheCompany = () => {
   useEffect(() => {
      AOS.init({
        duration: 1000,
        easing: "ease-linear",
        once: false,
      });
    }, [])

  return (
    <div className='w-full m-5 items-center justify-center mx-auto overflow-hidden'>
      {infos.map((info, index) => (
        <div
          key={index}
          className={cn('max-w-full items-start justify-center m-10 p-10 lg:flex gap-12 border border-gray-200 rounded-2xl ',index % 2 === 0 ? "flex-row-reverse" : "flex-row")}
        >
          <img src={info.image} alt="" width={800} className='rounded-xl bg-contain ' data-aos='fade-right' data-aos-delay='300' />

          <div className='flex flex-col justify-between' data-aos='fade-left' data-aos-delay='400'>
            <div className='flex gap-6 items-center mb-40'>
              <small className='text-gray-400 font-normal'>0{ index + 1 }</small>
              <h3 className='lg:text-xl font-semibold'>{info.title}</h3>
            </div>
            <div>
              <p className='text-justify items-center justify-center'>{info.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TheCompany