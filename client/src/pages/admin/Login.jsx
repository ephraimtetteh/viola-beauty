// Replace admin/Login.jsx with a simple redirect
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
  }, []);
  return null;
}
