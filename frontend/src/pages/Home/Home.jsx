import React, { useState } from "react";
import {
  Search,
  MapPin,
  Heart,
  Users,
  Store,
  Stethoscope,
  Scissors,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import "./Home.css";
export default function Home() {
  const [radius, setRadius] = useState(5);

  const services = [
    {
      id: 1,
      name: "Happy Paws Veterinary",
      type: "Veterinarian",
      distance: "0.8 km",
      rating: 4.8,
      image:
        "https://media.istockphoto.com/id/1308719194/photo/golden-retriver-dog-taking-a-shower-in-a-pet-grooming-salon.jpg?s=612x612&w=0&k=20&c=PM8Mnp4J3a8pO0i3aVFmd58JQnDycEOmbZy2kL_hPFo=",
      address: "123 Pet Street",
    },
    {
      id: 2,
      name: "Furry Friends Grooming",
      type: "Groomer",
      distance: "1.2 km",
      rating: 4.6,
      image:
        "https://media.istockphoto.com/id/599974692/photo/woman-using-a-comb-brush-the-persian-cat.jpg?s=612x612&w=0&k=20&c=sBif_WiCENQi-ca8svMEgAiV1DgEng2Ulk7JirtlQWA=",
      address: "456 Grooming Lane",
    },
    {
      id: 3,
      name: "Pet Paradise Store",
      type: "Pet Supplies",
      distance: "2.1 km",
      rating: 4.7,
      image:
        "https://t4.ftcdn.net/jpg/01/87/71/89/360_F_187718984_yItvN3joD4SjhyWzGfj4PY925WCmsyJh.jpg",
      address: "789 Supply Road",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section py-5 text-center">
        <div className="container">
          <h2 className="display-5 fw-bold">Find Pet Care Services Near You</h2>
          <p className="lead">
            Connect with trusted pet care professionals in your area
          </p>
          <div className="input-group w-50 mx-auto">
            <span className="input-group-text bg-white">
              <Search size={20} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for services..."
            />
            <span className="input-group-text bg-white">
              <MapPin size={20} />
            </span>
            <select
              className="form-select"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
            </select>
            <button className="btn btn-danger">Search</button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container py-5">
        <h2 className="text-center my-4 section-header">
          Explore Our Services
        </h2>
        <div className="row text-center">
          {[
            { icon: Stethoscope, title: "Veterinarians" },
            { icon: Scissors, title: "Pet Groomers" },
            { icon: Store, title: "Pet Supplies" },
          ].map((service, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card p-4 shadow-sm service-card">
                <service.icon size={40} className="text-danger mb-3" />
                <h4>{service.title}</h4>
                <p className="text-muted">
                  Find the best services for your pets
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-center my-4 section-header">Nearby Services</h2>
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-md-4 mb-4">
              <div className="card shadow-sm service-card">
                <img
                  src={service.image}
                  className="card-img-top"
                  alt={service.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{service.name}</h5>
                  <p className="card-text">{service.type}</p>
                  <div className="d-flex justify-content-between">
                    <span>
                      <MapPin size={16} /> {service.distance}
                    </span>
                    <span>⭐ {service.rating}</span>
                  </div>
                  <p className="text-muted mt-2">{service.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="community-section py-5 text-center">
        <h2 className="fw-bold">Join Our Pet Care Community</h2>
        <p className="lead">
          Connect with fellow pet owners and share experiences
        </p>
        <div className="container row mx-auto">
          {[
            { icon: Users, title: "Connect" },
            { icon: MessageCircle, title: "Share" },
            { icon: BookOpen, title: "Learn" },
          ].map((community, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card p-4 shadow-sm service-card">
                <community.icon size={40} className="text-danger mb-3" />
                <h4>{community.title}</h4>
                <p className="text-muted">Engage with pet lovers</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
