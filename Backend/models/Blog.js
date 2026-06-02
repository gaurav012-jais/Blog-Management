const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    author: {
      type: String,
      required: [true, 'Please add the author name'],
      trim: true,
      maxlength: [50, 'Author name cannot be more than 50 characters'],
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Blog', blogSchema);
