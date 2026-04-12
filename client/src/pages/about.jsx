import React from 'react'
import Hero from '../components/Hero'
import { images } from '../constants/data'
import TheArtist from '../components/TheArtist'
import WhyUs from '../components/WhyUs'
import Courses from '../components/Courses'
import CTAgallary from '../components/CTAgallary'

const About = () => {
  return (
    <div>
      <Hero image={images.about} />
      <TheArtist />
      {/* <WhyUs /> */}
      <Courses />
      <CTAgallary />
    </div>
  )
}

export default About