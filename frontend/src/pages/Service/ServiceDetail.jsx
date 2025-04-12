import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios'; // Import axios instance

const ServiceDetail = () => {
  const { id } = useParams(); // Get the service ID from the URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Service not found!"); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div className="container py-5 text-center"><h2>Loading service details...</h2></div>;
  }

  if (error) {
    return <div className="container py-5 text-center"><h2>{error}</h2></div>;
  }

  if (!service) {
    return null; // Or a different placeholder
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <img
          src={service.imageUrl}
          className="card-img-top"
          alt={service.name}
          style={{ maxHeight: '400px', objectFit: 'cover' }}
          onError={() => console.error(`Failed to load image for service: ${service.name}`)}
        />
        <div className="card-body">
          <h2 className="card-title">{service.name}</h2>
          <h5 className="card-subtitle mb-2 text-muted">{service.type}</h5>
          <p className="card-text">{service.description}</p>
          <hr />
          <p><strong>Rating:</strong> ⭐ {service.rating}</p>
          <p><strong>Distance:</strong> {service.distance}</p>
          <p><strong>Address:</strong> {service.address}</p>
          <p><strong>Phone:</strong> {service.phone}</p>
          <p><strong>Hours:</strong> {service.hours}</p>
          {/* Add more details as needed, e.g., map, reviews */}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
