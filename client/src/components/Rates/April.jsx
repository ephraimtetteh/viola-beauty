import { useEffect, useState } from "react";
import { rateImages } from "../../constants/data";
import BrideSection from "./BrideSection";
import RateCard from "./BridalRates";

const API = import.meta.env.VITE_API_URL;

const DEFAULT_PACKAGES = [
  {
    name: "Traditional Wedding",
    price: "GHS 4,000",
    features: [
      "Makeup at venue for traditional ceremony",
      "Hand application",
      "Two-hour service",
    ],
  },
  {
    name: "White Wedding",
    price: "GHS 5,000",
    features: [
      "Makeup at venue for white wedding",
      "Clean classic look",
      "Hand application",
      "Three hour service",
    ],
  },
  {
    name: "Double Dose",
    price: "GHS 7,000",
    features: [
      "Makeup for traditional wedding",
      "Makeup for white wedding",
      "Hand application",
      "2–3 hour service each day",
      "Complimentary makeup for bride's mum",
    ],
  },
];

export default function April() {
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/settings/rates`).then((r) => r.json()),
      fetch(`${API}/api/settings/rates_content`).then((r) => r.json()),
    ])
      .then(([rates, content]) => {
        if (content?.april_description) setDesc(content.april_description);
        if (content?.april_image) setImage(content.april_image);
        const bridal = rates?.bridal;
        if (!bridal?.length) return;
        setPackages((prev) =>
          prev.map((pkg) => {
            const match = bridal.find((b) =>
              b.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(pkg.name.toLowerCase().replace(/\s+/g, "")),
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
        title="The April Bride"
        image={image || rateImages[8]}
        description={
          desc ||
          "April is the peak of the spring season. Springtime is when we begin to see a little of the sun, and flowers start to blossom. If your personality reflects the springtime—laidback yet outgoing, subtle yet present—then you're Viola's April bride."
        }
        features={[
          "Clean matte or dewy skin that perfectly matches your complexion",
          "Subtle highlighting and contouring to enhance facial structure",
          "Neutral and natural eyeshadow look of your choice",
          "Barely-there or sultry faux mink lashes",
          "Feathery natural brows that mimic your own",
        ]}
      />
      <RateCard
        subtitle="Bespoke pricing for your special day. Choose the package that will be best suited for your forever moment."
        packages={packages}
      />
    </div>
  );
}
