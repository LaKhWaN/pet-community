import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

export default function EditServiceModal({ show, handleClose, serviceToEdit, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill form when serviceToEdit changes or modal opens
  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        name: serviceToEdit.name || '',
        description: serviceToEdit.description || '',
        price: serviceToEdit.price || '',
        location: serviceToEdit.location || '',
        imageUrl: serviceToEdit.imageUrl || '',
      });
    }
  }, [serviceToEdit, show]); // Re-run if serviceToEdit changes or modal visibility changes

  const { name, description, price, location, imageUrl } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!serviceToEdit?._id) {
        toast.error("Cannot update service: Invalid service ID.");
        return;
    }
    setLoading(true);
    try {
      // Only send fields that have actually changed? Or send all? Sending all is simpler for now.
      const res = await axiosInstance.put(`/services/${serviceToEdit._id}`, formData);
      toast.success('Service updated successfully!');
      onUpdateSuccess(res.data); // Pass the updated service data back
      // handleClose(); // Closing is handled by the parent via onUpdateSuccess callback
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to update service. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reset form state when modal is closed externally
  useEffect(() => {
    if (!show) {
       setFormData({ name: '', description: '', price: '', location: '', imageUrl: '' });
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Service</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Check if serviceToEdit exists before rendering form */}
        {serviceToEdit ? (
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="editServiceName">
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

            <Form.Group className="mb-3" controlId="editServiceDescription">
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

            <Form.Group className="mb-3" controlId="editServicePrice">
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

            <Form.Group className="mb-3" controlId="editServiceLocation">
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

            <Form.Group className="mb-3" controlId="editServiceImageUrl">
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
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Changes'}
            </Button>
             <Button variant="secondary" onClick={handleClose} className="ms-2" disabled={loading}>
                Cancel
             </Button>
          </Form>
        ) : (
           <p>Loading service details...</p> // Or an error message if serviceToEdit is null unexpectedly
        )}
      </Modal.Body>
    </Modal>
  );
}
