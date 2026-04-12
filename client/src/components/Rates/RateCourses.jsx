import React from 'react'
import RateCard from './BridalRates';

const RateCourses = () => {
  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold text-[#7c5546]">
            Your Best Self Is On The Inside!
          </h2>

          <p className="text-gray-600 text-justify mb-2">
            At Viola Beauty, we believe your true self or your personality is
            directly linked to how you view yourself on the outside. We have an
            aim to help you discover your best self through makeup
          </p>

          <p className="text-gray-600 text-justify mb-2">
            We pay attention to the character patterns that make up your
            personality and how that translates into how you love to look on the
            outside. Some people are fierce at heart and have a tendency to wear
            bold, bright looks whereas others who are more laid back love to
            show up in simpler, neutral looks
          </p>

          <p className="text-gray-600 text-justify">
            This is what our courses are made up of! What's your jam? We have
            the perfect course just for you!
          </p>
        </div>
      </div>

      <div className="mt-20 space-y-16">
        <RateCard
          title="CONSULTATION & PERSONAL SHOPPING"
          packages={[
            {
              name: "Consultation & Product List",
              price: "GHS 350",
              features: [
                "Once you've expressed your interest in our beauty courses, the next step is to find out how you love to wear your makeup and deduce your makeup goals from there. We will then curate a list of products for your exact makeup needs.",
              ],
            },
            {
              name: "Consultation & Personal Shopping",
              price: "USD 100",
              features: [
                "Once you've expressed your interest in our beauty courses, the next step is to find out how you love to wear your makeup and deduce your makeup goals from there. We will then curate a list of products for your exact makeup needs.",
                "Leave us with the task to shop for you. Personal shopping comes at a fee(does not include cost of products and have them delivered to residence at an extra fee for shipping). You have the option to come to the stores with us to test shades and conclude on products or have them delivered to your residence at an extra fee for shipping.",
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

export default RateCourses