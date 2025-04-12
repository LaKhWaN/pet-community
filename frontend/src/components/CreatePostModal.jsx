import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CreatePostModal = ({ show, handleClose, forumId, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(`/forums/${forumId}/posts`, { title, content });
      toast.success('Post created successfully!');
      onPostCreated(res.data); // Pass the new post data back to the parent
      handleClose(); // Close the modal
      // Reset form fields
      setTitle('');
      setContent('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create post.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal is closed/reopened
  const handleEnter = () => {
    setTitle('');
    setContent('');
    setError(null);
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} onEnter={handleEnter} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formPostTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPostContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Button variant="secondary" onClick={handleClose} disabled={loading} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Add Post'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
