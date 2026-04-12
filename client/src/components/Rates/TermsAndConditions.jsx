import { motion } from "framer-motion";

const TermsAndConditions = () => {
  const terms = [
    "You can only secure a date after a 30% deposit of your chosen package is made. This deposit is non-refundable.",
    "The balance should be paid one week before your chosen date. Payment confirms agreement to all terms and conditions.",
    "The bride loses all deposits if the booking is cancelled within one month of the wedding date.",
    "30% of the deposit is refunded if cancellation is communicated anytime before one month to your date.",
    "Trials and consultation appointments can only be arranged after a package is agreed upon and deposit has been paid.",
    "Packages include travel fares within a 20km radius. Locations beyond this range will attract additional travel fees.",
    "All bookings outside Accra are considered full-day bookings and will require travel and accommodation fees.",
    "Travel and accommodation preferences will be determined by the artist.",
    "Brides must disclose any allergies or sensitivities to beauty products beforehand.",
    "Brides must indicate whether they consent to their images being used for social media marketing."
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h3 className="text-sm tracking-widest text-[#7c5546] uppercase">
            Policies
          </h3>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-3">
            Terms & <span className="text-[#7c5546]">Conditions</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Please read our terms carefully before making a booking. These policies ensure a smooth and professional experience for every client.
          </p>
        </div>

        {/* TERMS LIST */}
        <div className="space-y-4">
          {terms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-[#7c5546] flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {term}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}


export default TermsAndConditions