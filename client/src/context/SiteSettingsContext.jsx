import { createContext, useContext, useState, useEffect } from "react";

const SiteSettingsContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

export const SiteSettingsProvider = ({ children }) => {
  const [fonts, setFonts] = useState({
    heading: "Outfit",
    body: "Outfit",
    accent: "Outfit",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings/fonts`)
      .then((r) => r.json())
      .then((data) => {
        if (data) setFonts(data);
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  const loadGoogleFont = (fontName) => {
    if (!fontName) return;
    const id = `gfont-${fontName.replace(/\s+/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      /\s+/g,
      "+",
    )}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  };

  return (
    <SiteSettingsContext.Provider
      value={{ fonts, setFonts, loadGoogleFont, loaded }}
    >
      <style>{`
  :root {
    --font-heading: "Outfit", serif;
    --font-body:    "Outfit", serif;
    --font-accent:  "Outfit", serif;
  }
  *, body, h1, h2, h3, h4, h5, h6, p, span, div,
  input, textarea, select, button {
    font-family: "Outfit", serif !important;
  }
`}</style>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
