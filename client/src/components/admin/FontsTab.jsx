import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const API = import.meta.env.VITE_API_URL;

const SYSTEM_FONTS = [
  "Georgia",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
  "Courier New",
];

const GOOGLE_FONTS_LIST = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Cormorant Garamond",
  "EB Garamond",
  "Libre Baskerville",
  "Source Serif Pro",
  "Josefin Sans",
  "Quicksand",
  "DM Sans",
  "Outfit",
  "Plus Jakarta Sans",
  "Cinzel",
  "Cardo",
  "Spectral",
  "Crimson Text",
  "Alegreya",
];

const ALL_FONTS = [...new Set([...SYSTEM_FONTS, ...GOOGLE_FONTS_LIST])].sort();

const GoldBar = () => (
  <div className="" />
);

const FontPreview = ({ font, text = "Viola Beauty" }) => {
  useEffect(() => {
    if (!SYSTEM_FONTS.includes(font)) {
      const id = `gfont-prev-${font.replace(/\s+/g, "-")}`;
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
          /\s+/g,
          "+",
        )}:wght@400;600&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [font]);

  return (
    <span
      style={{ fontFamily: `"${font}", sans-serif` }}
      className="text-lg text-[#1a1a1a]"
    >
      {text}
    </span>
  );
};

export default function FontsTab() {
  const { token } = useAuth();
  const {
    fonts: ctxFonts,
    setFonts: setCtxFonts,
    loadGoogleFont,
  } = useSiteSettings();

  const [fonts, setFonts] = useState(ctxFonts);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const filtered = search
    ? ALL_FONTS.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : ALL_FONTS;

  const selectFont = (role, font) => {
    setFonts((prev) => ({ ...prev, [role]: font }));
    loadGoogleFont(font);
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/api/settings/fonts`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ value: fonts }),
      });
      setCtxFonts(fonts);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset fonts to defaults?")) return;
    const defaults = { heading: "Georgia", body: "Inter", accent: "Georgia" };
    setFonts(defaults);
    try {
      await fetch(`${API}/api/settings/fonts/reset`, {
        method: "POST",
        headers,
      });
      setCtxFonts(defaults);
    } catch (err) {
      console.error(err);
    }
  };

  const inputCls =
    "w-full border border-[#e8d9cc] rounded-full px-4 py-2 text-sm " +
    "focus:outline-none focus:border-[#d4b86a] bg-white";

  const ROLES = [
    {
      key: "heading",
      label: "Heading Font",
      desc: "H1, H2, H3 — titles and section headers",
    },
    {
      key: "body",
      label: "Body Font",
      desc: "Paragraphs, labels, general text",
    },
    {
      key: "accent",
      label: "Accent Font",
      desc: "Quotes, callouts, decorative text",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Live preview */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        <GoldBar />
        <div className="p-6 space-y-3">
          <p
            className="text-xs font-semibold text-[#d4b86a] uppercase
            tracking-wider mb-4"
          >
            Live Preview
          </p>
          <div
            style={{ fontFamily: `"${fonts.heading}", serif` }}
            className="text-3xl font-semibold text-[#1a1a1a]"
          >
            Viola Beauty
          </div>
          <div
            style={{ fontFamily: `"${fonts.body}", sans-serif` }}
            className="text-sm text-gray-600"
          >
            A refined beauty experience designed to elevate your confidence and
            enhance your natural elegance.
          </div>
          <div
            style={{ fontFamily: `"${fonts.accent}", serif` }}
            className="text-sm text-[#7c5546] italic"
          >
            "True beauty is on the inside."
          </div>
          <div className="flex gap-3 pt-2 flex-wrap text-xs text-gray-400">
            <span>
              Heading: <strong>{fonts.heading}</strong>
            </span>
            <span>·</span>
            <span>
              Body: <strong>{fonts.body}</strong>
            </span>
            <span>·</span>
            <span>
              Accent: <strong>{fonts.accent}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Font search */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        <GoldBar />
        <div className="p-5">
          <p
            className="text-xs font-semibold text-[#d4b86a] uppercase
            tracking-wider mb-4"
          >
            Font Library
          </p>
          <input
            type="text"
            placeholder="Search fonts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-2">
            {filtered.length} fonts available · Click any font to see it in
            action
          </p>
        </div>
      </div>

      {/* Role selectors */}
      {ROLES.map(({ key, label, desc }) => (
        <div
          key={key}
          className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden"
        >
          <GoldBar />
          <div className="p-5">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-[#1a1a1a]">{label}</h3>
              <span
                className="text-xs bg-[#fdf6e3] text-[#7c5546] border
                border-[#d4b86a]/40 px-2 py-0.5 rounded-full"
              >
                {fonts[key]}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">{desc}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {filtered.map((font) => (
                <button
                  key={font}
                  onClick={() => selectFont(key, font)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-sm
                    transition-all ${
                      fonts[key] === font
                        ? "border-[#d4b86a] bg-[#fdf6e3] text-[#7c5546]"
                        : "border-[#e8d9cc] hover:border-[#d4b86a] text-gray-600"
                    }`}
                >
                  <FontPreview font={font} text={font} />
                  {fonts[key] === font && (
                    <span className="block text-[10px] text-[#d4b86a] mt-0.5">
                      ✦ Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Save / Reset */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-3 rounded-full border border-gray-200 text-gray-400
            text-sm hover:border-red-200 hover:text-red-400 transition"
        >
          Reset Defaults
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="flex-1 py-3 rounded-full bg-black text-white text-sm
            font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : saved
              ? "✓ Fonts Saved!"
              : "Apply Fonts to Site"}
        </button>
      </div>
    </div>
  );
}
