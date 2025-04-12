import React, { useState, useEffect } from 'react'; // Removed unused useEffect for now
import { Link } from 'react-router-dom';
import { MapPin, Search, AlertCircle, Loader } from 'lucide-react'; // Import icons
import { Alert, Spinner } from 'react-bootstrap'; // Import Bootstrap components

// Accept props from App.jsx
const ServicesPage = ({ services, loading, error, refreshServices }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(10); // Keep radius state if needed for filtering
  const [filteredServices, setFilteredServices] = useState(services); // Initialize with passed services

  // Update filteredServices when the main services list changes (e.g., after adding)
  useEffect(() => {
    // Basic filtering example (can be enhanced)
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(lowerCaseQuery) ||
      service.description.toLowerCase().includes(lowerCaseQuery) ||
      service.location.toLowerCase().includes(lowerCaseQuery)
      // Add more filtering logic based on radius if needed
    );
    setFilteredServices(filtered);
  }, [searchQuery, services, radius]); // Re-run filter when search, services, or radius change


  // Handle search button click (currently just filters the existing list)
  const handleSearch = () => {
    // Trigger filtering by updating state (already handled by useEffect)
    // If you wanted to re-fetch based on search, call refreshServices with query params
    console.log("Filtering based on:", searchQuery, "Radius:", radius);
  };

  return (
    <div className="container py-5">

      <div className="search-bar d-flex justify-content-center my-4">
        <div className="input-group w-50 mx-auto">
          <span className="input-group-text"><Search size={20}/></span>
          <input
            type="text"
            className="form-control "
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="input-group-text"> <MapPin size={20} /></span>
          <select
          className="form-select"
          value={radius}
          
          onChange={(e) => setRadius(Number(e.target.value))}
          >
            <option value={5}>5km</option>
            <option value={10}>10km</option>
            <option value={15}>15km</option>
            <option value={50}>50km</option>
          </select>
          <button className="btn btn-danger" onClick={handleSearch}>
            <Search size={20} /> Search </button>
        </div>
      </div>

      <h2 className="text-center my-4 section-header">Available Services</h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading services...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
         <Alert variant="danger" className="d-flex align-items-center">
           <AlertCircle className="me-2" />
           {error}
         </Alert>
      )}

      {/* Content: Show only if not loading and no error */}
      {!loading && !error && (
        <div className="row">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              // Use service._id from MongoDB as the key
              <div key={service._id} className="col-md-4 mb-4">
                <Link to={`/services/${service._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card shadow-sm service-card h-100">
                    <img
                      src={service.imageUrl} // Use imageUrl from DB
                      className="card-img-top"
                      alt={service.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                      // Add error handling for images if needed
                      onError={(e) => { e.target.onerror = null; e.target.src="https://dummyimage.com/300x200/cccccc/666666.png&text=Image+Not+Available"; }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{service.name}</h5>
                      <p className="card-text flex-grow-1">{service.description.substring(0, 100)}{service.description.length > 100 ? '...' : ''}</p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold">${service.price.toFixed(2)}</span>
                        <span className="text-muted">
                          <MapPin size={16} className="me-1" /> {service.location}
                        </span>
                      </div>
                      {/* Removed rating and distance as they are not in the model */}
                      {/* <p className="text-muted mt-2 mb-0">{service.address}</p> */}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            // No services found message
            <div className="col-12">
               <Alert variant="info" className="text-center">
                 No services found matching your criteria.
               </Alert>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesPage; // Keep only one export
