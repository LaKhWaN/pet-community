import React, { useState, useEffect } from 'react'; // Import useEffect
import { Link } from 'react-router-dom';
import { ListGroup, Button, Alert, Spinner } from 'react-bootstrap'; // Import Alert, Spinner
import { MessageSquare, PlusCircle, AlertCircle } from 'lucide-react'; // Import AlertCircle
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import axiosInstance from '../../utils/axios'; // Import axios instance
import { toast } from 'react-toastify'; // Import toast
import CreateForumModal from '../../components/CreateForumModal'; // Import the modal

const Forum = () => {
  const { user } = useAuth(); // Get user from context
  const [showCreateForumModal, setShowCreateForumModal] = useState(false);
  const [forums, setForums] = useState([]); // State for forums
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch forums on component mount
  useEffect(() => {
    const fetchForums = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/forums');
        setForums(res.data);
      } catch (err) {
        console.error("Error fetching forums:", err);
        const errorMsg = err.response?.data?.message || "Failed to load forums. Please try again later.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchForums();
  }, []); // Empty dependency array means run once on mount

  const handleShowCreateForumModal = () => setShowCreateForumModal(true);
  const handleCloseCreateForumModal = () => setShowCreateForumModal(false);

  // Function to handle successful forum creation
  const handleForumCreated = (newForum) => {
    // Add the newly created forum to the top of the list
    setForums((prevForums) => [newForum, ...prevForums]);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-header mb-0">Forums</h2>
        {/* Show Create Forum button only if user is admin */}
        {user && user.role === 'admin' && (
          <Button variant="primary" onClick={handleShowCreateForumModal}>
            <PlusCircle size={16} className="me-1" /> Create Forum
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading forums...</p>
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
        <ListGroup>
          {forums.length > 0 ? forums.map((forum) => (
            <ListGroup.Item
              key={forum._id}
              className="d-flex align-items-center"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <MessageSquare className="me-3 p-1" size={20} />
              <div>
                <Link to={`/forum/${forum._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5 className="mb-0">{forum.title}</h5>
                </Link>
                <p className="mb-0">{forum.description}</p>
                {/* Display creator name - check if createdBy exists and has name */}
                <small className="text-muted">
                  Created on {new Date(forum.createdAt).toLocaleDateString()}
                  {forum.createdBy && forum.createdBy.name ? ` by ${forum.createdBy.name}` : ''}
                </small>
              </div>
            </ListGroup.Item>
          )) : (
             <ListGroup.Item>No forums found.</ListGroup.Item>
          )}
        </ListGroup>
      )}

      {/* Render the CreateForumModal */}
      {user && user.role === 'admin' && (
        <CreateForumModal
          show={showCreateForumModal}
          handleClose={handleCloseCreateForumModal}
          onForumCreated={handleForumCreated}
        />
      )}
    </div>
  );
};

export default Forum;
