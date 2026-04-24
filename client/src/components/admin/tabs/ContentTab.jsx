import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import Card from "../ui/Card";
import ActionButton from "../ui/ActionButton";

const API = import.meta.env.VITE_API_URL;

const labelCls =
  "text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-1.5 block";
const textareaCls =
  "w-full border border-[#e8d9cc] rounded-2xl px-5 py-3 text-sm " +
  "focus:outline-none focus:border-[#d4b86a] bg-white resize-none transition";
const inputCls =
  "w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm " +
  "focus:outline-none focus:border-[#d4b86a] bg-white transition";

const SECTIONS = [
  { id: "hero", label: "Hero Slides" },
  { id: "rates", label: "Rates Text" },
  { id: "artist", label: "The Artist" },
  { id: "company", label: "The Company" },
];

// ── Shared: image upload ──
const ImageUpload = ({ label, value, onChange }) => {
  const inputRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-3 items-center">
        {value && (
          <img
            src={value}
            alt="preview"
            className="w-20 h-14 object-cover rounded-xl border border-[#e8d9cc] flex-shrink-0"
          />
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="px-4 py-2 rounded-full border border-[#e8d9cc] text-sm
              text-gray-500 hover:border-[#d4b86a] hover:text-[#7c5546] transition"
          >
            {value ? "Change" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-4 py-2 rounded-full border border-red-100
                text-red-400 text-xs hover:bg-red-50 transition"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
};

// ── Shared: save hook ──
const useSetting = (key) => {
  const token = localStorage.getItem("viola_token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings/${key}`)
      .then((r) => r.json())
      .then(setContent)
      .catch(console.error);
  }, [key]);

  const set = (field, val) => setContent((p) => ({ ...p, [field]: val }));

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/api/settings/${key}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ value: content }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return { content, set, save, saving, saved };
};

// ── Hero editor ──
const HeroEditor = ({ token }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const [slides, setSlides] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/settings/hero_slides`)
      .then((r) => r.json())
      .then((d) => setSlides(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (i, field, val) =>
    setSlides((p) =>
      p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
    );

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/api/settings/hero_slides`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ value: slides }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      {slides.map((slide, i) => (
        <Card key={i}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Slide {i + 1}
          </p>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Title</label>
              <input
                className={inputCls}
                value={slide.title || ""}
                onChange={(e) => set(i, "title", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input
                className={inputCls}
                value={slide.subtitle || ""}
                onChange={(e) => set(i, "subtitle", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Link</label>
              <input
                className={inputCls}
                value={slide.link || ""}
                onChange={(e) => set(i, "link", e.target.value)}
              />
            </div>
            <ImageUpload
              label="Slide Image"
              value={slide.image || ""}
              onChange={(val) => set(i, "image", val)}
            />
          </div>
        </Card>
      ))}
      <ActionButton onClick={save} loading={saving} className="w-full py-3">
        {saved ? "Saved" : "Save Hero Slides"}
      </ActionButton>
    </div>
  );
};

// ── Rates text editor ──
const RatesTextEditor = () => {
  const { content, set, save, saving, saved } = useSetting("rates_content");

  if (!content)
    return <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>;

  const textFields = [
    { key: "bridal_intro", label: "Bridal Intro", rows: 3 },
    { key: "april_description", label: "April Bride Description", rows: 3 },
    {
      key: "september_description",
      label: "September Bride Description",
      rows: 3,
    },
    { key: "halfday_description", label: "Half Day Description", rows: 3 },
    { key: "glam_tagline", label: "Glam Tagline", rows: 1 },
  ];

  const imageFields = [
    { key: "april_image", label: "April Bride Image" },
    { key: "september_image", label: "September Bride Image" },
    { key: "halfday_image", label: "Half Day Image" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Text Content
        </p>
        <div className="space-y-4">
          {textFields.map(({ key, label, rows }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <textarea
                rows={rows}
                className={textareaCls}
                value={content[key] || ""}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Images
        </p>
        <div className="space-y-5">
          {imageFields.map(({ key, label }) => (
            <ImageUpload
              key={key}
              label={label}
              value={content[key] || ""}
              onChange={(val) => set(key, val)}
            />
          ))}
        </div>
      </Card>
      <ActionButton onClick={save} loading={saving} className="w-full py-3">
        {saved ? "Saved" : "Save Rates Content"}
      </ActionButton>
    </div>
  );
};

// ── Artist page editor ──
const ArtistEditor = () => {
  const { content, set, save, saving, saved } = useSetting("about_content");

  if (!content)
    return <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Basic info */}
      <Card>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Artist Details
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Artist Name</label>
            <input
              className={inputCls}
              value={content.artist_name || ""}
              onChange={(e) => set("artist_name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Artist Quote</label>
            <textarea
              rows={2}
              className={textareaCls}
              value={content.artist_quote || ""}
              onChange={(e) => set("artist_quote", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Story sections */}
      <Card>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Story Sections — Each paragraph appears between images
        </p>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <label className={labelCls}>Section {n}</label>
              <textarea
                rows={4}
                className={textareaCls}
                value={content[`artist_section_${n}`] || ""}
                onChange={(e) => set(`artist_section_${n}`, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Images */}
      <Card>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Artist Images — One per section
        </p>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((n) => (
            <ImageUpload
              key={n}
              label={`Image ${n}`}
              value={content[`artist_image_${n}`] || ""}
              onChange={(val) => set(`artist_image_${n}`, val)}
            />
          ))}
        </div>
      </Card>

      <ActionButton onClick={save} loading={saving} className="w-full py-3">
        {saved ? "Saved" : "Save Artist Page"}
      </ActionButton>
    </div>
  );
};

// ── Company page editor ──
const CompanyEditor = () => {
  const { content, set, save, saving, saved } = useSetting("about_content");

  if (!content)
    return <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>;

  const INFO_COUNT = 3;

  return (
    <div className="space-y-4">
      {/* Company quote */}
      <Card>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Brand Quote
        </p>
        <div>
          <label className={labelCls}>Company Quote</label>
          <textarea
            rows={3}
            className={textareaCls}
            value={content.company_quote || ""}
            onChange={(e) => set("company_quote", e.target.value)}
          />
        </div>
      </Card>

      {/* Info sections */}
      {Array.from({ length: INFO_COUNT }, (_, i) => (
        <Card key={i}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Section {i + 1}
          </p>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Title</label>
              <input
                className={inputCls}
                value={content[`company_info_${i}_title`] || ""}
                onChange={(e) => set(`company_info_${i}_title`, e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Body Text</label>
              <textarea
                rows={5}
                className={textareaCls}
                value={content[`company_info_${i}_subtitle`] || ""}
                onChange={(e) =>
                  set(`company_info_${i}_subtitle`, e.target.value)
                }
              />
            </div>
            <ImageUpload
              label="Section Image"
              value={content[`company_info_${i}_image`] || ""}
              onChange={(val) => set(`company_info_${i}_image`, val)}
            />
          </div>
        </Card>
      ))}

      <ActionButton onClick={save} loading={saving} className="w-full py-3">
        {saved ? "Saved" : "Save Company Page"}
      </ActionButton>
    </div>
  );
};

// ── Main ──
export default function ContentTab() {
  const { token } = useAuth();
  const [section, setSection] = useState("hero");

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              section === s.id
                ? "bg-[#1a1a1a] text-white"
                : "border border-[#e8d9cc] text-gray-600 hover:border-[#d4b86a]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "hero" && <HeroEditor token={token} />}
      {section === "rates" && <RatesTextEditor />}
      {section === "artist" && <ArtistEditor />}
      {section === "company" && <CompanyEditor />}
    </div>
  );
}
