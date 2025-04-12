const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Forum', forumSchema);
