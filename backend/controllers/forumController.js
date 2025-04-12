const Forum = require('../models/forum');
const Post = require('../models/post');
const Comment = require('../models/comment'); // Import Comment model
const mongoose = require('mongoose');

// @desc    Get all forums
// @route   GET /api/forums
// @access  Public
exports.getForums = async (req, res) => {
  try {
    const forums = await Forum.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(forums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single forum by ID
// @route   GET /api/forums/:id
// @access  Public
exports.getForumById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Forum ID' });
    }
    const forum = await Forum.findById(req.params.id).populate('createdBy', 'name');
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }
    res.json(forum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a forum
// @route   POST /api/forums
// @access  Private/Admin
exports.createForum = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    // Assuming auth middleware adds user to req.user and role check is done in route
    const forum = new Forum({
      title,
      description,
      createdBy: req.user.id, // Get user ID from authenticated user
    });

    const createdForum = await forum.save();
    // Populate createdBy field before sending response
    await createdForum.populate('createdBy', 'name');
    res.status(201).json(createdForum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all posts for a specific forum
// @route   GET /api/forums/:id/posts
// @access  Public
exports.getPostsByForumId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Forum ID' });
    }
    // Check if forum exists
    const forumExists = await Forum.findById(req.params.id);
    if (!forumExists) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    const posts = await Post.find({ forumId: req.params.id })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
      }
      const post = await Post.findById(req.params.id).populate('createdBy', 'name');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Create a comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

    if (!text) {
      return res.status(400).json({ message: 'Please provide comment text' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      text,
      postId,
      createdBy: req.user.id,
    });

    const createdComment = await comment.save();
    await createdComment.populate('createdBy', 'name');
    res.status(201).json(createdComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
exports.getCommentsByPostId = async (req, res) => {
  try {
    console.log("getCommentsByPostId - req.params.id:", req.params.id); // Log raw req.params.id
    const postId = req.params.id;
    console.log("getCommentsByPostId - postId:", postId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.log("getCommentsByPostId - Invalid Post ID");
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

    const postExists = await Post.findById(postId);
    console.log("getCommentsByPostId - postExists:", postExists);
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ postId })
      .populate('createdBy', 'name')
      .sort({ createdAt: 1 }); // Sort by creation date (ascending for threaded view)

    console.log("getCommentsByPostId - comments:", comments);
    res.json(comments);
  } catch (error) {
    console.log("Error in getCommentsByPostId:", error); // Log the error
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Create a post in a forum
// @route   POST /api/forums/:id/posts
// @access  Private (Creator of the forum)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const forumId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(forumId)) {
      return res.status(400).json({ message: 'Invalid Forum ID' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    const post = new Post({
      title,
      content,
      forumId,
      createdBy: req.user.id,
    });

    const createdPost = await post.save();
    // Populate createdBy field before sending response
    await createdPost.populate('createdBy', 'name');
    res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
