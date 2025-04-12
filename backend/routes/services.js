const express = require('express');
const router = express.Router();
const {
  getServices,
  addService,
  getServiceById,
  updateService,
  deleteService,
  getMyServices // Import new controller functions
} = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');

// --- Public Routes ---

// @route   GET api/services
// @desc    Get all public services
// @access  Public
router.get('/', getServices);

// @route   GET api/services/my-services
// @desc    Get services created by the logged-in user
// @access  Private
router.get('/my-services', authMiddleware, getMyServices); 

// @route   GET api/services/:id
// @desc    Get single service by ID
// @access  Public
router.get('/:id', getServiceById);


// --- Private Routes (Require Authentication) ---

// @route   POST api/services
// @desc    Add a new service
// @access  Private
router.post('/', authMiddleware, addService);

// @route   PUT api/services/:id
// @desc    Update a service owned by the user
// @access  Private
router.put('/:id', authMiddleware, updateService);

// @route   DELETE api/services/:id
// @desc    Delete a service owned by the user
// @access  Private
router.delete('/:id', authMiddleware, deleteService);



module.exports = router;
