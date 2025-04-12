import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button, Alert, Spinner, ListGroup } from "react-bootstrap";
import { AlertCircle, ArrowDownRight } from "lucide-react";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const PostDetail = () => {
  const { id: postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      setLoadingComments(true);
      setError(null);
      setCommentError(null);
      try {
        const postRes = await axiosInstance.get(`/forums/posts/${postId}`);
        setPost(postRes.data);
        setLoading(false);

        const commentsRes = await axiosInstance.get(
          `/forums/posts/${postId}/comments`
        );
        setComments(commentsRes.data);
        setLoadingComments(false);
      } catch (err) {
        console.error("Error fetching post or comments:", err);
        const errorMsg =
          err.response?.data?.message ||
          "Failed to load data. Please try again later.";
        setError(errorMsg);
        setCommentError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        setLoadingComments(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axiosInstance.post(`/forums/posts/${postId}/comments`, {
        text: newComment,
      });
      toast.success("Comment added successfully!");
      setComments((prevComments) => [...prevComments, res.data]); // Add new comment to the list
      setNewComment(""); // Clear the input
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add comment.";
      setCommentError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <AlertCircle className="me-2" />
          {error}
        </Alert>
      </div>
    );
  }

  if (!post) {
    return <div className="container py-5">Post not found.</div>;
  }

  return (
    <div className="container py-5">
      {/* Post Detail Card */}
      <Card className="mb-4" style={{ backgroundColor: "#f8f9fa" }}>
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text>{post.content}</Card.Text>
          <Card.Subtitle className="mb-2 text-muted">
            Created on {new Date(post.createdAt).toLocaleDateString()}
            {post.createdBy && post.createdBy.name
              ? ` by ${post.createdBy.name}`
              : " by Unknown User"}
          </Card.Subtitle>
        </Card.Body>
      </Card>

      {/* Comments Section */}
      <h3 className="mt-5 mb-3">Comments</h3>

      {loadingComments ? (
        <div className="text-center my-3">
          <Spinner animation="border" size="sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading comments...</p>
        </div>
      ) : (
        <ListGroup className="mb-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <ListGroup.Item
                key={comment._id}
                className="d-flex align-items-start"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <ArrowDownRight className="me-2 mt-1 text-muted" size={20} />
                <div>
                  <div className="fw-bold">
                    {comment.createdBy?.name || "Unknown User"}
                  </div>
                  <div className="text-muted small">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                  <p className="mb-1">{comment.text}</p>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No comments yet.</ListGroup.Item>
          )}
        </ListGroup>
      )}

      {/* Add Comment Form */}
      {commentError && <Alert variant="danger">{commentError}</Alert>}
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group className="mb-3" controlId="commentForm.ControlTextarea">
          <Form.Label>Add a comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            disabled={!user} // Disable if user not logged in
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={!user || !newComment.trim()}
        >
          Submit Comment
        </Button>
        {!user && (
          <small className="ms-2 text-muted">Please log in to comment.</small>
        )}
      </Form>
    </div>
  );
};

export default PostDetail;
