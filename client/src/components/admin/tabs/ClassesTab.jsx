import { useState, useEffect } from "react";
import { useAuth }             from "../../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const inputCls = "w-full border border-[#e8d9cc] rounded-full px-4 py-2.5 text-sm " +
                 "focus:outline-none focus:border-[#d4b86a] bg-white";
const labelCls = "text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-1.5 block";

const GoldBar = () => (
  <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
);

const Card = ({ children }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
    <GoldBar />
    <div className="p-5">{children}</div>
  </div>
);

const EMPTY_FORM = {
  title: "", type: "beginner", description: "",
  date: "", time: "", location: "", duration: "",
  price: "", deposit: "", maxStudents: "",
};

export default function ClassesTab() {
  const { token } = useAuth();
  const [classes,       setClasses]       = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [view,          setView]          = useState("list"); // list | create | edit | registrations
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [editId,        setEditId]        = useState(null);
  const [saving,        setSaving]        = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization:  `Bearer ${token}`,
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/classes/admin/all`, { headers });
      setClasses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async (cls) => {
    setSelectedClass(cls);
    try {
      const res = await fetch(`${API}/api/classes/${cls._id}/registrations`, { headers });
      setRegistrations(await res.json());
    } catch (err) {
      console.error(err);
    }
    setView("registrations");
  };

  useEffect(() => { load(); }, []);

  const set = (field) => (e) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setView("create");
  };

  const openEdit = (cls) => {
    setForm({
      title:       cls.title,
      type:        cls.type,
      description: cls.description,
      date:        cls.date,
      time:        cls.time,
      location:    cls.location,
      duration:    cls.duration,
      price:       String(cls.price),
      deposit:     String(cls.deposit),
      maxStudents: String(cls.maxStudents),
    });
    setEditId(cls._id);
    setView("create");
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.price || !form.deposit)
      return alert("Fill in all required fields");

    setSaving(true);
    try {
      const body = {
        ...form,
        price:       Number(form.price),
        deposit:     Number(form.deposit),
        maxStudents: Number(form.maxStudents),
      };

      if (editId) {
        await fetch(`${API}/api/classes/${editId}`, {
          method: "PUT", headers, body: JSON.stringify(body),
        });
      } else {
        await fetch(`${API}/api/classes`, {
          method: "POST", headers, body: JSON.stringify(body),
        });
      }

      await load();
      setView("list");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (cls) => {
    await fetch(`${API}/api/classes/${cls._id}`, {
      method:  "PUT",
      headers,
      body:    JSON.stringify({ isActive: !cls.isActive }),
    });
    load();
  };

  const deleteClass = async (id) => {
    if (!confirm("Delete this class and all its registrations?")) return;
    await fetch(`${API}/api/classes/${id}`, { method: "DELETE", headers });
    load();
  };

  const today = new Date().toISOString().split("T")[0];

  // ── Registrations view ──
  if (view === "registrations" && selectedClass) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")}
            className="text-sm text-gray-400 hover:text-gray-600 transition">
            ← Back
          </button>
          <div>
            <h3 className="font-semibold text-[#1a1a1a]">
              {selectedClass.title}
            </h3>
            <p className="text-xs text-gray-400">{selectedClass.date}</p>
          </div>
          <a  href={`${API}/api/classes/${selectedClass._id}/registrations/export?token=${token}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto px-4 py-2 rounded-full bg-[#1a1a1a] text-white
              text-xs hover:bg-gray-800 transition">
                Export CSV
              </a>
        </div>

        {registrations.length > 0 ? (
          <Card>
            <p className="text-xs font-semibold text-[#d4b86a] uppercase
              tracking-wider mb-4">
              {registrations.length} Registration{registrations.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              {registrations.map(r => (
                <div key={r._id}
                  className="flex items-start justify-between gap-4 py-3
                    border-b border-[#f0e6dd] last:border-0">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[#1a1a1a]">
                      {r.firstName} {r.lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.email}</p>
                    <p className="text-xs text-gray-400">{r.phone}</p>
                    {r.experience && (
                      <p className="text-xs text-gray-400 mt-1">
                        Level: {r.experience}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-[#7c5546]">
                      GH₵ {(r.depositPaid / 100).toFixed(2)} deposit
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      r.status === "registered"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : r.status === "confirmed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-gray-400 text-center py-6">
              No registrations yet
            </p>
          </Card>
        )}
      </div>
    );
  }

  // ── Create / Edit form ──
  if (view === "create") {
    return (
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")}
            className="text-sm text-gray-400 hover:text-gray-600 transition">
            ← Back
          </button>
          <h3 className="font-semibold text-[#1a1a1a]">
            {editId ? "Edit Class" : "Create New Class"}
          </h3>
        </div>

        <Card>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Class Title *</label>
              <input type="text" placeholder="e.g. Everyday Glam Masterclass"
                value={form.title} onChange={set("title")} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Type *</label>
                <select value={form.type} onChange={set("type")} className={inputCls}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="professional">Professional</option>
                  <option value="group">Group</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Max Students *</label>
                <input type="number" placeholder="e.g. 10"
                  value={form.maxStudents} onChange={set("maxStudents")}
                  min="1" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                placeholder="What will students learn in this class?"
                value={form.description} onChange={set("description")}
                rows={3}
                className="w-full border border-[#e8d9cc] rounded-2xl px-4 py-3 text-sm
                  focus:outline-none focus:border-[#d4b86a] bg-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Date *</label>
                <input type="date" min={today}
                  value={form.date} onChange={set("date")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Time *</label>
                <input type="text" placeholder="e.g. 10:00am – 2:00pm"
                  value={form.time} onChange={set("time")} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Location *</label>
                <input type="text" placeholder="e.g. Viola's Studio, East Legon"
                  value={form.location} onChange={set("location")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Duration</label>
                <input type="text" placeholder="e.g. 4 hours"
                  value={form.duration} onChange={set("duration")} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Full Price (pesewas) *</label>
                <input type="number" placeholder="e.g. 150000 = GH₵1,500"
                  value={form.price} onChange={set("price")}
                  min="0" className={inputCls} />
                {form.price && (
                  <p className="text-xs text-gray-400 mt-1 pl-1">
                    = GH₵ {(Number(form.price) / 100).toFixed(2)}
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>Deposit (pesewas) *</label>
                <input type="number" placeholder="e.g. 30000 = GH₵300"
                  value={form.deposit} onChange={set("deposit")}
                  min="0" className={inputCls} />
                {form.deposit && (
                  <p className="text-xs text-gray-400 mt-1 pl-1">
                    = GH₵ {(Number(form.deposit) / 100).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-[#f0e6dd]">
            <button onClick={() => setView("list")}
              className="px-5 py-2.5 rounded-full border border-gray-200
                text-gray-400 text-sm hover:border-gray-300 transition">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-full bg-black text-white text-sm
                font-medium hover:bg-gray-800 transition disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update Class" : "Create Class"}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[#1a1a1a]">
          Upcoming Classes ({classes.length})
        </h3>
        <button onClick={openCreate}
          className="px-5 py-2 rounded-full bg-black text-white text-sm
            font-medium hover:bg-gray-800 transition">
          + New Class
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : classes.length > 0 ? (
        <div className="space-y-3">
          {classes.map(cls => {
            const isPast = cls.date < today;
            return (
              <div key={cls._id}
                className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
                {/* <GoldBar /> */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#1a1a1a]">{cls.title}</h4>
                        {isPast && (
                          <span className="text-[10px] text-gray-400 border
                            border-gray-200 px-2 py-0.5 rounded-full">
                            Past
                          </span>
                        )}
                        {!cls.isActive && !isPast && (
                          <span className="text-[10px] text-amber-600 border
                            border-amber-200 bg-amber-50 px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>{cls.date}</span>
                        <span>·</span>
                        <span>{cls.time}</span>
                        <span>·</span>
                        <span>{cls.location}</span>
                        <span>·</span>
                        <span>GH₵ {(cls.price / 100).toFixed(2)}</span>
                        <span>·</span>
                        <span>Max {cls.maxStudents} students</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => loadRegistrations(cls)}
                        className="text-xs px-3 py-1.5 rounded-full border
                          border-[#d4b86a] text-[#7c5546] hover:bg-[#fdf6e3] transition"
                      >
                        Registrations
                      </button>
                      <button onClick={() => openEdit(cls)}
                        className="text-xs px-3 py-1.5 rounded-full border
                          border-[#e8d9cc] text-gray-500 hover:border-[#d4b86a]
                          hover:text-[#7c5546] transition">
                        Edit
                      </button>
                      {!isPast && (
                        <button onClick={() => toggleActive(cls)}
                          className="text-xs px-3 py-1.5 rounded-full border
                            border-[#e8d9cc] text-gray-400 hover:border-gray-300 transition">
                          {cls.isActive ? "Hide" : "Show"}
                        </button>
                      )}
                      <button onClick={() => deleteClass(cls._id)}
                        className="text-xs px-3 py-1.5 rounded-full border
                          border-red-200 text-red-400 hover:bg-red-50 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-gray-400 text-center py-6">
            No classes yet — click "+ New Class" to create one
          </p>
        </Card>
      )}
    </div>
  );
}