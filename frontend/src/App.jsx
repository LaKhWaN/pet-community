import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import Service from "./pages/Service/Service";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
