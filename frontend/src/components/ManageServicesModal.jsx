import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

// Import the modals we just created
import EditServiceModal from "./EditServiceModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function ManageServicesModal({
  show,
  handleClose,
  onServiceUpdated,
  onServiceDeleted,
}) {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for controlling Edit/Delete modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null); // Service to edit or delete

  const fetchMyServices = useCallback(async () => {
    if (!show) return; // Don't fetch if modal is not shown
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/services/my-services");
      setMyServices(res.data);
    } catch (err) {
      console.error("Error fetching user's services:", err);
      setError("Failed to load your services. Please try again.");
      toast.error("Failed to load your services.");
    } finally {
      setLoading(false);
    }
  }, [show]); // Dependency on 'show' to refetch when modal opens

  useEffect(() => {
    fetchMyServices();
  }, [fetchMyServices]); // Fetch when the modal is shown/opened

  const handleEditClick = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedService(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedService(null);
  };

  // Callback after successful update
  const handleUpdateSuccess = (updatedService) => {
    setMyServices((prev) =>
      prev.map((s) => (s._id === updatedService._id ? updatedService : s))
    );
    onServiceUpdated(updatedService); // Notify App.jsx
    handleCloseEditModal();
  };

  // Callback after successful delete
  const handleDeleteSuccess = (deletedServiceId) => {
    setMyServices((prev) => prev.filter((s) => s._id !== deletedServiceId));
    onServiceDeleted(deletedServiceId); // Notify App.jsx
    handleCloseDeleteModal();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage My Services</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && (
            <ListGroup>
              {myServices.length > 0 ? (
                myServices.map((service) => (
                  <ListGroup.Item
                    key={service._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-1">{service.name}</h6>
                      <small className="text-muted">{service.location}</small>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditClick(service)}
                      >
                        <Pencil size={16} /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(service)}
                      >
                        <Trash2 size={16} /> Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-center text-muted">
                  You haven't added any services yet.
                </p>
              )}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Service Modal */}
      {selectedService && (
        <EditServiceModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          serviceToEdit={selectedService}
          onUpdateSuccess={handleUpdateSuccess} // Pass the success handler
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedService && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          serviceToDelete={selectedService}
          onDeleteSuccess={handleDeleteSuccess} // Pass the success handler
        />
      )}
    </>
  );
}
