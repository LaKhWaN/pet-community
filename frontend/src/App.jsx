import React, { useState, useEffect, useCallback } from "react"; // Import hooks
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./utils/axios"; // Import axios instance
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import Service from "./pages/Service/Service";
import Forum from "./pages/Forum/Forum";
import Login from "./components/Login";
import Register from "./components/Register";
import ServiceDetail from "./pages/Service/ServiceDetail"; // Import the new component
import { AuthProvider } from "./context/AuthContext";
import Profile from "./components/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import ForumDetail from "./pages/Forum/ForumDetail";
import PostDetail from "./pages/Forum/PostDetail"; // Import PostDetail
import NotFound from "./components/NotFound"; // Import NotFound component

function App() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState(null);

  // Function to fetch services
  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    setErrorServices(null);
    try {
      const res = await axiosInstance.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setErrorServices("Failed to load services. Please try again later.");
      toast.error("Failed to load services.");
    } finally {
      setLoadingServices(false);
    }
  }, []); // useCallback to memoize the function

  // Fetch services on initial mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handler for when a new service is added
  const handleServiceAdded = (newService) => {
    // Add the new service to the beginning of the list for immediate visibility
    setServices((prevServices) => [newService, ...prevServices]);
    // Optionally, could re-fetch all services instead: fetchServices();
  };

  // Handler for when a service is updated
  const handleServiceUpdated = (updatedService) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service._id === updatedService._id ? updatedService : service
      )
    );
    // Optionally re-fetch: fetchServices();
  };

  // Handler for when a service is deleted
  const handleServiceDeleted = (deletedServiceId) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service._id !== deletedServiceId)
    );
     // Optionally re-fetch: fetchServices();
  };


  return (
    <AuthProvider>
      {/* Pass all handlers down to Navbar */}
      <Navbar
        onServiceAdded={handleServiceAdded}
        onServiceUpdated={handleServiceUpdated}
        onServiceDeleted={handleServiceDeleted}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Pass services state and fetch function */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/services"
            element={
              <Service
                services={services}
                loading={loadingServices}
                error={errorServices}
                refreshServices={fetchServices} // Pass fetch function for potential refresh trigger
              />
            }
          />
          {/* ServiceDetail might also need access to fetch a single service */}
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/forum/:id" element={<ForumDetail />} />
        <Route path="/forum/:forumId/:id" element={<PostDetail />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
