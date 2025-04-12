const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  forumId: {
    type: Schema.Types.ObjectId,
    ref: 'Forum',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Post', postSchema);
