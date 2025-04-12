import React, { useState, useEffect } from 'react'; // Import useEffect
import { Link, useParams } from 'react-router-dom';
import { ListGroup, Button, Alert, Spinner } from 'react-bootstrap'; // Import Alert, Spinner
import { MessageSquare, PlusCircle, AlertCircle } from 'lucide-react'; // Import AlertCircle
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import axiosInstance from '../../utils/axios'; // Import axios instance
import { toast } from 'react-toastify'; // Import toast
import CreatePostModal from '../../components/CreatePostModal'; // Import CreatePostModal

const ForumDetail = () => {
  const { id: forumId } = useParams(); // Get the forum ID from the URL, rename to forumId
  const { user } = useAuth(); // Get user from context
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [forum, setForum] = useState(null); // State for forum details
  const [posts, setPosts] = useState([]); // State for posts
  const [loadingForum, setLoadingForum] = useState(true); // Loading state for forum
  const [loadingPosts, setLoadingPosts] = useState(true); // Loading state for posts
  const [error, setError] = useState(null); // Error state

  // Fetch forum details and posts on component mount or when forumId changes
  useEffect(() => {
    const fetchForumAndPosts = async () => {
      setLoadingForum(true);
      setLoadingPosts(true);
      setError(null);
      try {
        // Fetch forum details
        const forumRes = await axiosInstance.get(`/forums/${forumId}`);
        setForum(forumRes.data);
        setLoadingForum(false);

        // Fetch posts for the forum
        const postsRes = await axiosInstance.get(`/forums/${forumId}/posts`);
        setPosts(postsRes.data);
        setLoadingPosts(false);

      } catch (err) {
        console.error("Error fetching forum details or posts:", err);
        const errorMsg = err.response?.data?.message || "Failed to load forum data. Please try again later.";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoadingForum(false);
        setLoadingPosts(false);
      }
    };

    fetchForumAndPosts();
  }, [forumId]); // Re-fetch if forumId changes

  const handleShowCreatePostModal = () => setShowCreatePostModal(true);
  const handleCloseCreatePostModal = () => setShowCreatePostModal(false);

  // Function to handle successful post creation
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-header mb-0">{forum?.title}</h2>
        {/* Show Add Post button if user is logged in */}
        {user && (
          <Button variant="primary" onClick={handleShowCreatePostModal}>
            <PlusCircle size={16} className="me-1" /> Add Post
          </Button>
        )}
      </div>
      <p>{forum?.description}</p>
      <p className="text-muted">
        Created by {forum?.createdBy?.name || 'Unknown User'} on {new Date(forum?.createdAt).toLocaleDateString()}
      </p>

      {/* Loading Posts State */}
      {loadingPosts && (
        <div className="text-center my-5">
          <Spinner animation="border" size="sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading posts...</p>
        </div>
      )}

      {/* Posts List (show only if not loading posts) */}
      {!loadingPosts && (
        <ListGroup>
          {posts.length > 0 ? posts.map((post) => (
            <ListGroup.Item
              key={post._id}
              className="d-flex align-items-center"
              style={{ backgroundColor: '#f8f9fa', marginTop: '10px' }}
            >
              <MessageSquare className="me-3 p-1" size={20} />
              <div >
                <Link to={`/forum/${forumId}/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5 className="mb-0">{post.title}</h5>
                </Link>
                {/* Displaying only title in the list now, content is in detail */}
                <small className="text-muted">
                  Created on {new Date(post.createdAt).toLocaleDateString()}
                  {post.createdBy && post.createdBy.name ? ` by ${post.createdBy.name}` : ''}
                </small>
              </div>
            </ListGroup.Item>
          )) : (
            <ListGroup.Item>No posts in this forum yet.</ListGroup.Item>
          )}
        </ListGroup>
      )}

      {/* Render the CreatePostModal */}
      {user && (
        <CreatePostModal
          show={showCreatePostModal}
          handleClose={handleCloseCreatePostModal}
          forumId={forumId}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default ForumDetail;
