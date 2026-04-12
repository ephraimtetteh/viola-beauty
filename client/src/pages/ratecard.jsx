import React from 'react'
import Image from '../components/Image'
import Hero from '../components/Hero'
import Button from '../components/Button'
import WorkshopEducation from '../components/WorkshopComponent'
import Rates from '../components/Rates/Index'

const Ratecard = () => {
  return (
    <div className="mt-22 relative">
      {/* <WorkshopEducation /> */}
      {/* <Hero
        image={images.about5}
        title={"THE SIGNATURE GLAM SERIES"}
        tagline={"Master the art behind the Viola Beauty finish"}
      /> */}
      <Rates />
    </div>
  );
}

export default Ratecard