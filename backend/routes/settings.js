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
    // ── Artist page ──
    artist_name: "Vincentia Ocloo",
    artist_bio:
      "My journey begun in 2014 with students in my university. With over 1000 clients since then, I have garnered a great deal of knowledge of the art on different skin tones and face shapes through experience.",
    artist_section_1:
      "I remember so vividly how much I looked forward to Sundays because I got to wear my mum's foundation and lipstick and choose my own clothes for church. I was about ten years old and I think this was the highlight of my week after all the bore from school.",
    artist_section_2:
      "In my teenage years, I started trying new makeup products. I would sneak into my older cousins' makeup bags and experiment with blushes, eyeshadow, mascaras and liners. By university, I already had a fair idea of makeup and its application and thankfully, all my close friends did too.",
    artist_section_3:
      "People all around me loved makeup and that fuelled my interest and love for it. Some of my friends in school started asking me to do their makeup after they had seen mine and before I knew it, I had turned what I loved into a small business.",
    artist_section_4:
      "My greatest desire and hope on this journey is to help you search within and find the well of beauty inside that is waiting to be unearthed.",
    artist_quote:
      "True beauty is on the inside. When wearing your makeup, remember to wear your personality and who you truly are.",
    artist_image_1: "",
    artist_image_2: "",
    artist_image_3: "",
    artist_image_4: "",
    // ── Company page ──
    company_quote:
      "At Viola Beauty, we believe that who you are on the inside runs parallel with how you like to look on the outside.",
    company_info_0_title: "Artistry",
    company_info_0_subtitle:
      "My journey begun in 2014 with students in my university. With over 1000 clients since then, I have garnered a great deal of knowledge of the art on different skin tones and face shapes through experience. The consistent and repetitive nature of my work has honed and is still honing my craft.",
    company_info_0_image: "",
    company_info_1_title: "Education & Speaking",
    company_info_1_subtitle:
      "The business and art of makeup is finally getting all the recognition it deserves worldwide. With all that I have learnt over the period of my artistry, I believe I must contribute my quota to the industry by pouring into anyone who wants to pursue a career in beauty.",
    company_info_1_image: "",
    company_info_2_title: "Influencer Marketing",
    company_info_2_subtitle:
      "For nine years, I have studied and worked with an extensive spread of different brands of makeup products and I have learnt so much about what formula works for which skin, which product produces what finish, and the multipurpose use of products.",
    company_info_2_image: "",
    hero_image: "",
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
