import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../utils/axios'; // Assuming you have an axios instance configured
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function AddServiceModal({ show, handleClose, onServiceAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const { name, description, price, location, imageUrl } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Add validation before submitting
      const formDataWithUser = { ...formData, createdBy: user.id };
      const res = await axiosInstance.post('/services', formDataWithUser);
      toast.success('Service added successfully!');
      onServiceAdded(res.data); // Pass the new service data back
      handleClose(); // Close modal on success
      // Reset form after successful submission
      setFormData({ name: '', description: '', price: '', location: '', imageUrl: '' });
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to add service. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Service</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="serviceName">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter service name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="serviceDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the service"
              name="description"
              value={description}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="servicePrice">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              name="price"
              value={price}
              onChange={onChange}
              required
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="serviceLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location (e.g., City, State)"
              name="location"
              value={location}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="serviceImageUrl">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter image URL (e.g., https://...)"
              name="imageUrl"
              value={imageUrl}
              onChange={onChange}
              required
            />
             <Form.Text className="text-muted">
              Please provide a direct link to the image.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Service'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
