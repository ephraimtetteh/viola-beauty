import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import { images } from '../constants/data'
import Text from '../components/Text'
import WhyUs from '../components/WhyUs'
import TheCompany from '../components/TheCompany'
import AOS from 'aos'
import Courses from '../components/Courses'

const Company = () => {
   useEffect(() => {
      AOS.init({
        duration: 5000,
        easing: "ease-linear",
        once: false,
      });
    }, [])

  return (
    <div className='overflow-hidden' >
      <Hero
        image={images.company}
        // title={"Discover your signature discover you!"}
        className={"text-4xl"}
        data-aos='zoom-in'
      />
      <div data-aos-delay='500'>
        <Text
          text={
            '"At Viola Beauty, we believe that who you are on the inside runs parallel with how you like to look on the outside. Your personality, values, thoughts and emotions at any given time influences your choice of clothes, accessories, scents and makeup looks. The prime message of this brand is to look for the beauty within you and wear it on the outside."'
          }
        />
      </div>
      <TheCompany />
      <WhyUs />
      <Courses />
    </div>
  );
}

export default Company