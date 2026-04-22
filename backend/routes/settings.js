import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const DEFAULTS = {
  fonts: {
    heading: "Outfit",
    body: "Outfit",
    accent: "Outfit",
  },
  rates: {
    bridal: [
      { name: "Traditional Wedding", price: "GHS 4,000" },
      { name: "White Wedding", price: "GHS 5,000" },
      { name: "Double Dose", price: "GHS 7,000" },
      { name: "September Traditional Wedding", price: "GHS 4,500" },
      { name: "September White Wedding", price: "GHS 5,000" },
      { name: "September Double Dose", price: "GHS 7,500" },
      { name: "6hrs", price: "GHS 7,000" },
      { name: "8hrs", price: "GHS 9,000" },
      { name: "10hrs", price: "GHS 10,000" },
      { name: "Civil Wedding", price: "GHS 2,500" },
      { name: "Sunday Thanksgiving Glam", price: "GHS 2,000" },
      { name: "Mother of the Bride", price: "GHS 1,000" },
      { name: "Bridesmaid Glam (per head)", price: "GHS 800" },
    ],
    glam: [
      { name: "Soft Glam", price: "GHS 1,000" },
      { name: "Bold Glam", price: "GHS 1,100" },
      { name: "VIP Glam", price: "GHS 1,500" },
      { name: "Celebrant Reception Glam", price: "GHS 1,500" },
      { name: "Baby Christening Glam", price: "GHS 1,500" },
      { name: "Essentials", price: "GHS 1,000" },
      { name: "Prestige", price: "GHS 2,000" },
      { name: "Half Day", price: "GHS 4,000" },
      { name: "Family Glam", price: "GHS 4,000" },
      { name: "Studio Glam Session By Head Artist", price: "GHS 750" },
      { name: "Studio Glam Session By Other Artist", price: "GHS 500" },
      { name: "Complexion Testing & Product List", price: "GHS 500" },
    ],
    courses: [
      { name: "Personal Glam — In-Person 1 Day", price: "GHS 1,500" },
      { name: "Personal Glam — In-Person 2 Days", price: "GHS 2,450" },
      { name: "Personal Glam — In-Person 3 Days", price: "GHS 3,250" },
      { name: "Personal Glam — Online 1 Day", price: "GHS 1,000" },
      { name: "Personal Glam — Online 2 Days", price: "GHS 1,800" },
      { name: "Intermediate — 5 Days", price: "GHS 4,500" },
      { name: "Professional Internship — 4 Weeks", price: "GHS 7,500" },
      { name: "Group Course 2 Days", price: "GHS 7,000–10,000" },
      { name: "Consultation & Product List", price: "GHS 350" },
      { name: "Consultation & Personal Shopping", price: "USD 100" },
    ],
  },
  // ── Hero slides ──
  hero_slides: [
    {
      title: "Online Education",
      subtitle: "Learn at your pace. Master your finish. Show up boldly.",
      link: "/courses",
      image: "",
    },
    {
      title: "Discover Viola Beauty",
      subtitle: "",
      link: "/our-works",
      image: "",
    },
    {
      title: "The Bridal Experience",
      subtitle: "",
      link: "/book-us",
      image: "",
    },
    {
      title: "Let's unveil you through beauty",
      subtitle: "",
      link: "/book-us",
      image: "",
    },
  ],
  // ── About page ──
  about_content: {
    hero_image: "",
    artist_name: "Vincentia Ocloo",
    artist_bio:
      "My journey begun in 2014 with students in my university. With over 1000 clients since then, I have garnered a great deal of knowledge of the art on different skin tones and face shapes through experience.",
    company_quote:
      "At Viola Beauty, we believe that who you are on the inside runs parallel with how you like to look on the outside.",
    company_image: "",
  },
  // ── Rates page text ──
  rates_content: {
    april_description:
      "April is the peak of the spring season. Springtime is when we begin to see a little of the sun, and flowers start to blossom. If your personality reflects the springtime—laidback yet outgoing, subtle yet present—then you're Viola's April bride.",
    september_description:
      "September is the month of transition from summer to fall. You're a September bride if you're outspoken, fearless and adventurous. You love to let everyone know you have arrived. You're a diva, PERIOD!",
    halfday_description:
      "Viola's full day experience is a full on luxury service where you have our head artist on site for a preferred number of hours starting from 6 hours.",
    glam_tagline: "A Day In My Chair 2026",
    bridal_intro:
      "Congratulations on your engagement and thank you for considering us for your big day. We're excited to bring you THE EXPERIENCE.",
    april_image: "",
    september_image: "",
    halfday_image: "",
  },
};

router.get("/:key", async (req, res) => {
  try {
    const setting = await SiteSettings.findOne({ key: req.params.key });
    res.json(setting?.value ?? DEFAULTS[req.params.key] ?? null);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

router.put("/:key", protect, async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined)
      return res.status(400).json({ error: "Value required" });
    const setting = await SiteSettings.findOneAndUpdate(
      { key: req.params.key },
      { value, updatedAt: new Date() },
      { new: true, upsert: true },
    );
    await Activity.create({
      type: "settings",
      message: `Site content updated: ${req.params.key}`,
    });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

router.post("/:key/reset", protect, async (req, res) => {
  try {
    await SiteSettings.findOneAndDelete({ key: req.params.key });
    res.json({ success: true, value: DEFAULTS[req.params.key] });
  } catch (err) {
    res.status(500).json({ error: "Reset failed" });
  }
});

export default router;
