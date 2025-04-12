import React, { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false); // Prevents duplicate toasts

  useEffect(() => {
    if (!user && !toastShown.current) {
      toast.warning("Please log in to access this page!");
      toastShown.current = true; // Mark as shown
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
