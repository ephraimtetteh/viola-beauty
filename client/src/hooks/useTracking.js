import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

let socket = null;

const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ["websocket"] });
  }
  return socket;
};

export const useTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const s = getSocket();
    s.emit("page_view", {
      page: location.pathname,
      referrer: document.referrer,
    });

    // Also fire a REST log
    fetch(`${SOCKET_URL}/api/tracking/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: location.pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  }, [location.pathname]);

  const trackBooking = (event, category) => {
    getSocket().emit("booking_event", { event, category });
  };

  return { trackBooking };
};
