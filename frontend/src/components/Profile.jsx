import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Image } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLocation(user.location);
      if (user.profilePhoto) {
        setPreviewUrl(
          `${import.meta.env.VITE_BACKEND_URL}${user.profilePhoto}`
        );
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.user;
      updatedUser.profilePhoto = `${import.meta.env.VITE_BACKEND_URL}${
        updatedUser.profilePhoto
      }`;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Profile Settings</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Profile"
                      roundedCircle
                      width="150"
                      height="150"
                      className="mb-3"
                    />
                  )}
                  <Form.Group>
                    <Form.Label>Update Profile Photo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={user?.email}
                    disabled
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button className="w-100" type="submit" disabled={loading}>
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
