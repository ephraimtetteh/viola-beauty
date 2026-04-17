import { useEffect, useState } from "react";
import { rateImages } from "../../constants/data";
import BrideSection from "./BrideSection";
import RateCard from "./BridalRates";

const API = import.meta.env.VITE_API_URL;

export default function April() {
  const [packages, setPackages] = useState([
    {
      name: "Traditional Wedding",
      price: "GHS 4,000",
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
        "2–3 hour service on each day",
        "Complimentary makeup for bride's mum on wedding day",
      ],
    },
  ]);

  useEffect(() => {
    fetch(`${API}/api/settings/rates`)
      .then((r) => r.json())
      .then((data) => {
        const bridal = data?.bridal;
        if (!bridal?.length) return;
        // Map April packages from bridal rates
        const april = bridal.filter(
          (p) =>
            p.name.toLowerCase().includes("april") ||
            p.name.toLowerCase().includes("traditional") ||
            p.name.toLowerCase().includes("white wedding") ||
            p.name.toLowerCase().includes("double dose"),
        );
        if (april.length) {
          setPackages((prev) =>
            prev.map((pkg) => {
              const match = bridal.find((b) =>
                b.name
                  .toLowerCase()
                  .includes(pkg.name.toLowerCase().split(" ")[0]),
              );
              return match ? { ...pkg, price: match.price } : pkg;
            }),
          );
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <BrideSection
        title="The April Bride"
        image={rateImages[8]}
        description="April is the peak of the spring season. Springtime is when we begin to see a little of the sun, and flowers start to blossom. If your personality reflects the springtime—laidback yet outgoing, subtle yet present—then you're Viola's April bride."
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
