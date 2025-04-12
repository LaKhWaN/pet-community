const express = require('express');
const router = express.Router();
const {
  getForums,
  getForumById,
  createForum,
  getPostsByForumId,
  createPost,
  getPostById,
  createComment,
  getCommentsByPostId,
} = require('../controllers/forumController');
const authMiddleware = require('../middleware/auth');

// Basic Admin middleware (replace with more robust role check if needed)
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Forum Routes
router.route('/')
  .get(getForums)
  .post(authMiddleware, adminMiddleware, createForum); // Protect create forum route

router.route('/:id')
  .get(getForumById);

// Post Routes within a Forum
router.route('/:id/posts')
  .get(getPostsByForumId)
  .post(authMiddleware, createPost); // Protect create post route (controller checks ownership)

// Separate route for getting a single post by its ID
router.route('/posts/:id') // Changed route to avoid conflict
    .get(getPostById);

// Comment Routes within a Post
router.route('/posts/:id/comments')
  .get(getCommentsByPostId)
  .post(authMiddleware, createComment);

module.exports = router;
