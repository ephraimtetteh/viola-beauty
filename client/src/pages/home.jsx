import React from "react";
import HeroSlider from "../components/HeroSlider";
import AboutComponent from "../components/AboutComponent";
import CTAgallary from "../components/CTAgallary";
import Testimonials from "../components/Testimonials";
import Text from "../components/Text";
import Image from "../components/Image";
import { images } from "../constants/data";
import Courses from "../components/Courses";
import CTA from "../components/CTA";

const Home = () => {
  return (
    <>
      <HeroSlider />
      <Text
        text={
          '"We are a beauty brand offering makeup products, services and education. At our core, we believe in authenticity. We use makeup as a tool to help individuals explore what they love, what they don’t, what they are drawn to, and what new expressions they are willing to embrace. Through beauty, we help others unveil their inner, true selves."'
        }
      />
      <Courses />
      <AboutComponent />
      <CTA />
      {/* <Image
        image={images.bgImage}
        title={"You're so talented Vincentia ❤️❤️❤️"}
        /> */}
        <Testimonials />
      <CTAgallary />
    </>
  );
};

export default Home;
