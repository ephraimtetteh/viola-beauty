import { createContext, useContext, useState, useEffect } from "react";

const SiteSettingsContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

const GOOGLE_FONTS = [
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
];

export const SiteSettingsProvider = ({ children }) => {
  const [fonts, setFonts] = useState({
    heading: "Georgia",
    body: "Inter",
    accent: "Georgia",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings/fonts`)
      .then((r) => r.json())
      .then((data) => {
        if (data) setFonts(data);
        loadGoogleFont(data?.heading);
        loadGoogleFont(data?.body);
        loadGoogleFont(data?.accent);
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  const loadGoogleFont = (fontName) => {
    if (!fontName || isSystemFont(fontName)) return;
    const id = `gfont-${fontName.replace(/\s+/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      /\s+/g,
      "+",
    )}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  };

  const isSystemFont = (name) =>
    [
      "Georgia",
      "Arial",
      "Helvetica",
      "Times New Roman",
      "Courier New",
      "Verdana",
      "Trebuchet MS",
    ].includes(name);

  return (
    <SiteSettingsContext.Provider
      value={{ fonts, setFonts, loadGoogleFont, GOOGLE_FONTS, loaded }}
    >
      {/* Apply fonts globally */}
      <style>{`
        :root {
          --font-heading: "${fonts.heading}", Georgia, serif;
          --font-body:    "${fonts.body}",    Inter, sans-serif;
          --font-accent:  "${fonts.accent}",  Georgia, serif;
        }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
        body, p, span, div, input, textarea, select, button {
          font-family: var(--font-body);
        }
      `}</style>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
export { GOOGLE_FONTS };
