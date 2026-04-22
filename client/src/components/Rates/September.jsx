import { useEffect, useState } from "react";
import { rateImages } from "../../constants/data";
import BrideSection from "./BrideSection";
import RateCard from "./BridalRates";

const API = import.meta.env.VITE_API_URL;

const DEFAULT_PACKAGES = [
  {
    name: "Traditional Wedding",
    price: "GHS 4,500",
    features: [
      "Makeup application at a given venue for traditional marriage ceremony",
      "Hand application",
      "Two-hour service",
    ],
  },
  {
    name: "White Wedding",
    price: "GHS 5,000",
    features: [
      "Makeup application at a given venue for white wedding",
      "This is a clean, classic look that involves more time",
      "Hand application",
      "Three-hour service",
    ],
  },
  {
    name: "Double Dose",
    price: "GHS 7,500",
    features: [
      "Makeup for traditional wedding",
      "Makeup for white wedding",
      "Hand application",
      "2–3 hour service on each day",
      "Complimentary makeup for bride's mum on wedding day",
    ],
  },
];

const DEFAULT_DESC =
  "September is the month of transition from summer to fall. " +
  "In September, the heat of the summer sun is just about going down. Bright summer " +
  "flowers are already giving way for bold, dark fall colours. You're a September bride " +
  "if you're outspoken, fearless and adventurous. You love to let everyone know you have " +
  "arrived. You're a diva, PERIOD!";

export default function September() {
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [desc, setDesc] = useState(DEFAULT_DESC);
  const [image, setImage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/settings/rates`).then((r) => r.json()),
      fetch(`${API}/api/settings/rates_content`).then((r) => r.json()),
    ])
      .then(([rates, content]) => {
        if (content?.september_description)
          setDesc(content.september_description);
        if (content?.september_image) setImage(content.september_image);

        const bridal = rates?.bridal;
        if (!bridal?.length) return;

        setPackages((prev) =>
          prev.map((pkg) => {
            const key = pkg.name.toLowerCase().replace(/\s+/g, "");
            const match =
              bridal.find(
                (b) =>
                  b.name.toLowerCase().replace(/\s+/g, "").includes(key) &&
                  b.name.toLowerCase().includes("september"),
              ) ||
              bridal.find((b) =>
                b.name.toLowerCase().replace(/\s+/g, "").includes(key),
              );
            return match ? { ...pkg, price: match.price } : pkg;
          }),
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <BrideSection
        title="The September Bride"
        image={image || rateImages[9]}
        description={desc}
        features={[
          "Medium to full coverage skin that matches your complexion perfectly",
          "Highlighting and contouring to enhance and sculpt facial structure",
          "Feathery, natural brows that mimic your own brow hairs",
          "Bold or nude eyes and lips, you get to choose",
          "Bold or sultry faux mink lashes",
        ]}
      />
      <RateCard
        title="The September Bride - Rates"
        subtitle="Bespoke pricing for your special day. Choose the package that will be best suited for your forever moment."
        packages={packages}
      />
    </div>
  );
}
