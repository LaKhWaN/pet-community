const Service = require("../models/service");

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Add a new service
// @route   POST /api/services
// @access  Private (Requires Authentication)
exports.addService = async (req, res) => {
  const { name, description, price, location, imageUrl } = req.body;

  // Basic validation (Mongoose schema handles more)
  if (!name || !description || !price || !location || !imageUrl) {
    return res.status(400).json({ msg: "Please include all fields" });
  }

  try {
    const newService = new Service({
      name,
      description,
      price,
      location,
      imageUrl,
      createdBy: req.user.id, // Associate the logged-in user
    });

    const service = await newService.save();
    res.status(201).json(service); // Return the newly created service
  } catch (err) {
    console.error(err.message);
    // Handle potential validation errors from Mongoose
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ msg: messages.join(", ") });
    }
    res.status(500).send("Server Error");
  }
};

// @desc    Get services created by the logged-in user
// @route   GET /api/services/my-services
// @access  Private
exports.getMyServices = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const services = await Service.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Service not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
exports.updateService = async (req, res) => {
  const { name, description, price, location, imageUrl } = req.body;

  // Build service object based on fields submitted
  const serviceFields = {};
  if (name) serviceFields.name = name;
  if (description) serviceFields.description = description;
  if (price) serviceFields.price = price;
  if (location) serviceFields.location = location;
  if (imageUrl) serviceFields.imageUrl = imageUrl;

  try {
    let service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ msg: "Service not found" });

    // Make sure user is authenticated
    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    if (service.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    try {
      // Wrap the update in a try-catch block
      service = await Service.findByIdAndUpdate(
        req.params.id,
        { $set: serviceFields },
        { new: true, runValidators: true } // Return the updated doc, run schema validators
      );

      "Service updated successfully:", service; // Log success

      res.json(service);
    } catch (updateErr) {
      // Catch errors during the update
      console.error("Error during service update:", updateErr);
      if (updateErr.name === "ValidationError") {
        const messages = Object.values(updateErr.errors).map(
          (val) => val.message
        );
        return res.status(400).json({ msg: messages.join(", ") });
      }
      if (updateErr.kind === "ObjectId") {
        return res.status(404).json({ msg: "Service not found" });
      }
      res.status(500).send("Server Error");
    }
  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ msg: messages.join(", ") });
    }
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Service not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ msg: "Service not found" });

    // Make sure user owns the service
    if (service.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Mongoose 6+ findByIdAndDelete is preferred
    await Service.findByIdAndDelete(req.params.id);
    // For older Mongoose: await service.remove();

    res.json({ msg: "Service removed successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Service not found" });
    }
    res.status(500).send("Server Error");
  }
};
