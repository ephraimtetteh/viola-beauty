

const testimonials = [
  {
    name: "Sarah K.",
    role: "Beauty Enthusiast",
    quote:
      "What I loved most about this workshop was how clearly everything was explained. I finally understand how to blend my eyeshadow properly.",
  },
  {
    name: "Amanda L.",
    role: "Beginner Makeup Artist",
    quote:
      "The layering techniques completely changed how I apply foundation. My makeup finally looks smooth and professional.",
  },
  {
    name: "Chloe M.",
    role: "Beauty Lover",
    quote:
      "Vincentia explains everything with so much warmth and detail. I feel much more confident doing my own glam now.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-center mb-16">
          Student Results
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
              <p className="text-gray-600 mb-6 italic">"{item.quote}"</p>

              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
