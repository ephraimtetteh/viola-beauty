import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/our-works", label: "Portfolio" },
  { to: "/courses", label: "Education" },
  { to: "/contact-us", label: "Contact" },
];

const ABOUT_LINKS = [
  { to: "/about-company", label: "The Company" },
  { to: "/about", label: "The Artist" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin } = useAuth();

  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);
  const isAboutActive = ABOUT_LINKS.some((l) => pathname.startsWith(l.to));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const handle = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const linkCls = (to) =>
    `transition-colors duration-200 ${
      isActive(to) ? "text-[#d4b86a] font-semibold" : "hover:text-[#d4b86a]"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between
      px-4 md:px-8 lg:px-12 transition-all duration-500
      ${isScrolled ? "py-3 bg-white shadow-md" : "py-5 bg-white"}`}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        Viola Beauty
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 font-medium text-sm">
        <Link to="/" className={linkCls("/")}>
          Home
        </Link>

        {/* About dropdown */}
        <div className="relative group">
          <button
            className={`flex items-center gap-1 transition-colors duration-200 ${
              isAboutActive
                ? "text-[#d4b86a] font-semibold"
                : "hover:text-[#d4b86a]"
            }`}
          >
            About
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 18 18"
              className="group-hover:rotate-180 transition-transform duration-300"
            >
              <path
                d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div
            className="absolute top-full left-0 mt-3 w-44 bg-white shadow-xl
            rounded-xl py-2 opacity-0 invisible translate-y-3
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
            transition-all duration-300 border border-[#f0e6dd]"
          >
            {ABOUT_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  pathname === to
                    ? "text-[#d4b86a] font-semibold bg-[#fdf6e3]"
                    : "hover:bg-[#fdf6e3] hover:text-[#d4b86a]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {[
          { to: "/our-works", label: "Portfolio" },
          { to: "/courses", label: "Education" },
          { to: "/contact-us", label: "Contact" },
        ].map(({ to, label }) => (
          <Link key={to} to={to} className={linkCls(to)}>
            {label}
          </Link>
        ))}
      </div>

      {/* Desktop right */}
      <div className="hidden md:flex items-center gap-3">
        {isAdmin ? (
          // ── Admin is logged in — show admin panel link ──
          <Link
            to="/admin"
            className={`flex items-center gap-2 text-sm font-medium transition
              ${
                pathname.startsWith("/admin")
                  ? "text-[#d4b86a]"
                  : "text-[#7c5546] hover:text-[#d4b86a]"
              }`}
          >
            <span
              className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#d4b86a]
              flex items-center justify-center text-xs font-bold text-[#d4b86a]"
            >
              A
            </span>
            Dashboard
          </Link>
        ) : user ? (
          // ── Regular user logged in ──
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium
              text-[#7c5546] hover:text-[#d4b86a] transition"
          >
            <span
              className="w-7 h-7 rounded-full bg-[#fdf6e3] border border-[#d4b86a]
              flex items-center justify-center text-xs font-bold text-[#7c5546]"
            >
              {user.firstName?.[0]}
            </span>
            {user.firstName}
          </Link>
        ) : (
          // ── Not logged in ──
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600
              hover:text-[#d4b86a] transition"
          >
            Sign In
          </Link>
        )}

        <Link
          to="/book-us"
          className={`px-6 py-2.5 rounded-full text-sm transition ${
            pathname === "/book-us"
              ? "bg-[#7c5546] text-white"
              : "bg-black text-white hover:bg-neutral-800"
          }`}
        >
          Book Us
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden p-2 z-[60] relative"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 bg-white z-[55] flex flex-col items-center
        justify-center gap-6 text-lg font-medium transition-transform duration-500
        md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close */}
        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 text-xl text-gray-400
            hover:text-gray-600"
        >
          ×
        </button>

        {/* Brand */}
        <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-2">
          Viola Beauty
        </p>

        {/* Main links */}
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={closeMenu}
            className={`transition-colors ${
              isActive(to)
                ? "text-[#d4b86a] font-semibold"
                : "hover:text-[#d4b86a]"
            }`}
          >
            {label}
          </Link>
        ))}

        {/* About links */}
        <div
          className="flex flex-col items-center gap-3 border-t
          border-[#f0e6dd] pt-4 w-40"
        >
          {ABOUT_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`text-base transition-colors ${
                pathname === to
                  ? "text-[#d4b86a] font-semibold"
                  : "hover:text-[#d4b86a] text-gray-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth link */}
        {isAdmin ? (
          // ── Admin — dashboard link ──
          <Link
            to="/admin"
            onClick={closeMenu}
            className="flex items-center gap-2 text-[#d4b86a] font-medium"
          >
            <span
              className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#d4b86a]
              flex items-center justify-center font-bold text-sm text-[#d4b86a]"
            >
              A
            </span>
            Admin Dashboard
          </Link>
        ) : user ? (
          // ── User ──
          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="flex items-center gap-2 text-[#7c5546]"
          >
            <span
              className="w-8 h-8 rounded-full bg-[#fdf6e3] border border-[#d4b86a]
              flex items-center justify-center font-bold text-sm"
            >
              {user.firstName?.[0]}
            </span>
            My Account
          </Link>
        ) : (
          // ── Not logged in ──
          <Link
            to="/login"
            onClick={closeMenu}
            className="text-base hover:text-[#d4b86a] transition text-gray-600"
          >
            Sign In
          </Link>
        )}

        {/* Book Us */}
        <Link
          to="/book-us"
          onClick={closeMenu}
          className="bg-black text-white px-8 py-3 rounded-full
            hover:bg-neutral-800 transition mt-2"
        >
          Book Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
