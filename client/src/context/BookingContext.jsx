import { createContext, useContext, useState } from "react";
import BookingModal from "../components/BookingModal";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState("");

  const openBooking = (category = "") => {
    setDefaultCategory(category);
    setIsOpen(true);
  };

  const closeBooking = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      <BookingModal
        isOpen={isOpen}
        onClose={closeBooking}
        defaultCategory={defaultCategory}
      />
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
