import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

const CreateForumModal = ({ show, handleClose, onForumCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post('/forums', { title, description });
      toast.success('Forum created successfully!');
      onForumCreated(res.data); // Pass the new forum data back to the parent
      handleClose(); // Close the modal
      // Reset form fields
      setTitle('');
      setDescription('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create forum.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal is closed/reopened
  const handleEnter = () => {
    setTitle('');
    setDescription('');
    setError(null);
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} onEnter={handleEnter} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Forum</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formForumTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter forum title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formForumDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter forum description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Button variant="secondary" onClick={handleClose} disabled={loading} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Forum'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateForumModal;
