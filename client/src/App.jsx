import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Ratecard from "./pages/ratecard";
import Portfolio from "./pages/portfolio";
import About from "./pages/about";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Contact from "./pages/contact";
import Company from "./pages/company";
import CheckoutPage from "./pages/checkout";
import SuccessPage from "./pages/success";
import BookingPage from "./pages/booking";
import ClassRegistration from "./pages/classRegistration";
import AdminSetup from "./pages/admin/Setup";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { useTracking } from "./hooks/useTracking";

const Education = lazy(() => import("./pages/education"));
const Home = lazy(() => import("./pages/home"));

const PageLoader = () => (
  <div
    className="min-h-screen bg-[#fff8f5] flex flex-col items-center
    justify-center gap-6"
  >
    <div className="text-center space-y-1">
      <p className="text-xs tracking-[6px] uppercase text-[#d4b86a] font-medium">
        Viola Beauty
      </p>
      <p className="text-sm text-gray-400 tracking-wide">
        Preparing your experience...
      </p>
    </div>
    <div className="w-48 h-0.5 bg-[#f0e6dd] rounded-full overflow-hidden">
      <div className="h-full bg-[#d4b86a] rounded-full animate-[slideIn_1.4s_ease-in-out_infinite] w-[40%]" />
    </div>
    <p className="text-xs text-gray-400 italic max-w-xs text-center leading-relaxed mt-2">
      "True beauty is on the inside."
    </p>
    <style>{`
      @keyframes slideIn {
        0%   { transform: translateX(-100%); }
        50%  { transform: translateX(250%);  }
        100% { transform: translateX(-100%); }
      }
    `}</style>
  </div>
);

// ── Inner app — has access to router context ──
const AppInner = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { trackBooking } = useTracking(); // tracking runs on every route change

  // ── AOS initialized ONCE here only ──
  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {!isAdmin && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/about-company" element={<Company />} />
        <Route path="/our-works" element={<Portfolio />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/class-registration" element={<ClassRegistration />} />
        <Route
          path="/book-us"
          element={
            <Suspense fallback={<PageLoader />}>
              <Ratecard />
            </Suspense>
          }
        />
        <Route
          path="/courses"
          element={
            <Suspense fallback={<PageLoader />}>
              <Education />
            </Suspense>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/setup" element={<AdminSetup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <SiteSettingsProvider>
      <BookingProvider>
        <AppInner />
      </BookingProvider>
    </SiteSettingsProvider>
  </AuthProvider>
);

export default App;
