import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const DEFAULT_SECTIONS = [
  {
    title: "Personal Glam",
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
    groups: [{ subtitle: "In-Person One-One", items: ["5 days — GHS 4,500"] }],
  },
  {
    title: "Professional Course",
    groups: [
      { subtitle: "Internship Course", items: ["4 weeks — GHS 7,500"] },
      {
        subtitle: "Group Course (5–10 students)",
        items: ["2 days — GHS 7,000 – 10,000"],
      },
    ],
  },
];

export default function RateClases() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  useEffect(() => {
    fetch(`${API}/api/settings/rates`)
      .then((r) => r.json())
      .then((data) => {
        const courses = data?.courses;
        if (!courses?.length) return;
        // Rebuild items from API data
        setSections([
          {
            title: "Personal Glam",
            groups: [
              {
                subtitle: "In-Person One-One",
                items: courses
                  .filter((c) => c.name.toLowerCase().includes("in-person"))
                  .map(
                    (c) =>
                      `${c.name.split("—")[1]?.trim() || c.name} — ${c.price}`,
                  ),
              },
              {
                subtitle: "Online One-One",
                items: courses
                  .filter((c) => c.name.toLowerCase().includes("online"))
                  .map(
                    (c) =>
                      `${c.name.split("—")[1]?.trim() || c.name} — ${c.price}`,
                  ),
              },
            ],
          },
          {
            title: "Intermediate Course",
            groups: [
              {
                subtitle: "In-Person One-One",
                items: courses
                  .filter((c) => c.name.toLowerCase().includes("intermediate"))
                  .map(
                    (c) =>
                      `${c.name.split("—")[1]?.trim() || c.name} — ${c.price}`,
                  ),
              },
            ],
          },
          {
            title: "Professional Course",
            groups: [
              {
                subtitle: "Internship Course",
                items: courses
                  .filter((c) => c.name.toLowerCase().includes("internship"))
                  .map(
                    (c) =>
                      `${c.name.split("—")[1]?.trim() || c.name} — ${c.price}`,
                  ),
              },
              {
                subtitle: "Group Course (5–10 students)",
                items: courses
                  .filter((c) => c.name.toLowerCase().includes("group"))
                  .map(
                    (c) =>
                      `${c.name.split("—")[1]?.trim() || c.name} — ${c.price}`,
                  ),
              },
            ],
          },
        ]);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-3">
            Training Programs
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold mt-2">
            Beauty <span className="text-[#7c5546]">Courses</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 mb-4">
            <div className="h-px w-10 bg-[#d4b86a]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]" />
            <div className="h-px w-10 bg-[#d4b86a]" />
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Learn professional makeup artistry through our structured courses
            designed for beginners and aspiring professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg
                transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.groups.map((group, gi) => (
                    <div key={gi}>
                      <p
                        className="text-xs font-semibold text-[#7c5546] uppercase
                        tracking-wider mb-2"
                      >
                        {group.subtitle}
                      </p>
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
