import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Ratecard from "./pages/ratecard";
import Portfolio from "./pages/portfolio";
import About from "./pages/about";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Contact from "./pages/contact";
import Company from "./pages/company";
import CheckoutPage from "./pages/checkout";
import SuccessPage from "./pages/success";
import { BookingProvider } from "./context/BookingContext";
import BookingPage from "./pages/booking";
import ClassRegistration from "./pages/ClassRegistration";

import AdminSetup from "./pages/admin/Setup";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";

import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/UserDashboard";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";


const Education = lazy(() => import("./pages/education"));
const Booking = lazy(() => import("./pages/ratecard"));
const Home = lazy(() => import("./pages/home"));

// ── Branded Loading Screen ──
const PageLoader = () => (
  <div className="min-h-screen bg-[#fff8f5] flex flex-col items-center justify-center gap-6">
    {/* Brand name */}
    <div className="text-center space-y-1">
      <p className="text-xs tracking-[6px] uppercase text-[#d4b86a] font-medium">
        Viola Beauty
      </p>
      <p className="text-sm text-gray-400 tracking-wide">
        Preparing your experience...
      </p>
    </div>

    {/* Animated gold bar */}
    <div className="w-48 h-0.5 bg-[#f0e6dd] rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#d4b86a] to-[#7c5546] rounded-full"
        style={{
          animation: "slideIn 1.4s ease-in-out infinite",
          width: "40%",
        }}
      />
    </div>

    {/* Dot pulse */}
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]"
          style={{
            animation: "pulse 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>

    {/* Quote */}
    <p className="text-xs text-gray-400 italic max-w-xs text-center leading-relaxed mt-2">
      "True beauty is on the inside!."
    </p>

    {/* Keyframes */}
    <style>{`
      @keyframes slideIn {
        0%   { transform: translateX(-100%); }
        50%  { transform: translateX(250%); }
        100% { transform: translateX(-100%); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50%       { opacity: 1;   transform: scale(1.2); }
      }
    `}</style>
  </div>
);

const App = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <BookingProvider>
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
              <Route
                path="/class-registration"
                element={<ClassRegistration />}
              />

              <Route
                path="/book-us"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Booking />
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

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User dashboard */}
              <Route path="/dashboard" element={<UserDashboard />} />

              {/* Admin */}
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Dashboard />} />
            </Routes>
            <Footer />
          </div>
        </BookingProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  );
};

export default App;
