import { motion } from "framer-motion";

export default function RateClases() {
  const sections = [
    {
      title: "Personal Glam",
      badge: "Beginner",
      groups: [
        {
          subtitle: "In-Person One-One",
          items: [
            "1 day — GHS 1,500",
            "2 days — GHS 2,450",
            "3 days — GHS 3,250",
          ],
        },
        {
          subtitle: "Online One-One",
          items: ["1 day — GHS 1,000", "2 days — GHS 1,800"],
        },
      ],
    },
    {
      title: "Intermediate Course",
      badge: "Intermediate",
      groups: [
        {
          subtitle: "In-Person One-One",
          items: ["5 days — GHS 4,500"],
        },
      ],
    },
    {
      title: "Professional Course",
      badge: "Professional",
      groups: [
        {
          subtitle: "Internship Course",
          items: ["4 weeks — GHS 7,500"],
        },
        {
          subtitle: "Group Course (5–10 students)",
          items: ["2 days — GHS 7,000 – 10,000"],
        },
      ],
    },
  ];

  const badgeColors = {
    Beginner: "bg-[#fdf6e3] text-[#7c5546] border-[#d4b86a]/40",
    Intermediate: "bg-[#f5f0ff] text-[#6b46c1] border-[#6b46c1]/20",
    Professional: "bg-[#1a1a1a] text-[#d4b86a] border-transparent",
  };

  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-3">
            Training Programs
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold mt-2">
            Beauty <span className="text-[#7c5546]">Courses</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 mb-4">
            <div className="h-px w-10 bg-[#d4b86a]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]"></div>
            <div className="h-px w-10 bg-[#d4b86a]"></div>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Learn professional makeup artistry through our structured courses
            designed for beginners and aspiring professionals.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Card top accent */}
              {/* <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" /> */}

              <div className="p-6 space-y-5">
                {/* Title + badge */}
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[#1a1a1a]">
                    {section.title}
                  </h2>
                  {/* <span
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${badgeColors[section.badge]}`}
                  >
                    {section.badge}
                  </span> */}
                </div>

                {/* Groups */}
                <div className="space-y-4">
                  {section.groups.map((group, gi) => (
                    <div key={gi}>
                      {/* Subtitle */}
                      <p className="text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-2">
                        {group.subtitle}
                      </p>

                      {/* Items */}
                      <ul className="space-y-1.5">
                        {group.items.map((item, ii) => (
                          <li
                            key={ii}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="text-[#d4b86a] mt-0.5 flex-shrink-0">
                              ✦
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* Divider between groups */}
                      {gi < section.groups.length - 1 && (
                        <div className="mt-4 border-t border-[#f0e6dd]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
