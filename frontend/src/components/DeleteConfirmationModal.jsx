import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

export default function DeleteConfirmationModal({ show, handleClose, serviceToDelete, onDeleteSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!serviceToDelete?._id) {
      setError("Cannot delete service: Invalid service ID.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/services/${serviceToDelete._id}`);
      toast.success('Service deleted successfully!');
      onDeleteSuccess(serviceToDelete._id); // Pass the ID of the deleted service back
      // handleClose(); // Closing is handled by the parent via onDeleteSuccess callback
    } catch (err) {
      console.error("Error deleting service:", err);
      const errorMsg = err.response?.data?.msg || 'Failed to delete service. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

   // Reset error state when modal is closed externally
   useEffect(() => {
    if (!show) {
       setError(null);
    }
  }, [show]);


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {serviceToDelete ? (
          <p>Are you sure you want to delete the service "<strong>{serviceToDelete.name}</strong>"? This action cannot be undone.</p>
        ) : (
          <p>Loading service details...</p> // Should not happen if logic is correct
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading || !serviceToDelete}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Delete Service'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
