import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const GoldBar = () => (
  <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
);

const inputCls =
  "border border-[#e8d9cc] rounded-full px-4 py-2 text-sm " +
  "focus:outline-none focus:border-[#d4b86a] w-full bg-white";

const CATEGORIES = [
  { id: "bridal", label: " Bridal" },
  { id: "glam", label: "Glam Sessions" },
  { id: "courses", label: "Courses" },
];

export default function RatesTab() {
  const { token } = useAuth();
  const [category, setCategory] = useState("bridal");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/settings/rates`)
      .then((r) => r.json())
      .then((data) => setItems(data?.[category] || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  const add = () => setItems([...items, { name: "", price: "" }]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, f, v) =>
    setItems(
      items.map((item, idx) => (idx === i ? { ...item, [f]: v } : item)),
    );

  const save = async () => {
    setSaving(true);
    try {
      // Get current rates for all categories first
      const res = await fetch(`${API}/api/settings/rates`);
      const all = (await res.json()) || {};

      // Update only the current category
      await fetch(`${API}/api/settings/rates`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ value: { ...all, [category]: items } }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm(`Reset ${category} rates to defaults?`)) return;
    try {
      const res = await fetch(`${API}/api/settings/rates/reset`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      setItems(data?.value?.[category] || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              category === c.id
                ? "bg-[#1a1a1a] text-white"
                : "border border-[#e8d9cc] text-gray-600 hover:border-[#d4b86a]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        {/* <GoldBar /> */}
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[#1a1a1a] capitalize">
              {category} Rates
            </h3>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200
                  text-gray-400 hover:border-red-200 hover:text-red-400 transition"
              >
                Reset defaults
              </button>
              <button
                onClick={add}
                className="text-sm px-4 py-1.5 rounded-full border border-[#d4b86a]
                  text-[#7c5546] hover:bg-[#fdf6e3] transition"
              >
                + Add Item
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Loading...
            </div>
          ) : (
            <div className="space-y-3">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_140px_36px] gap-3 pb-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider pl-1">
                  Service / Package Name
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wider pl-1">
                  Price
                </p>
                <div />
              </div>

              {items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_140px_36px] gap-3 items-center"
                >
                  <input
                    value={item.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="Package or service name"
                    className={inputCls}
                  />
                  <input
                    value={item.price}
                    onChange={(e) => update(i, "price", e.target.value)}
                    placeholder="e.g. GHS 1,500"
                    className={inputCls}
                  />
                  <button
                    onClick={() => remove(i)}
                    className="w-9 h-9 rounded-full border border-red-200
                      text-red-400 hover:bg-red-50 transition flex items-center
                      justify-center flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}

              {!items.length && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No items yet — click "+ Add Item" to start
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-5 pt-4 border-t border-[#f0e6dd]">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 py-3 rounded-full bg-black text-white text-sm
                font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
