const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// Routes mapping for GET all blogs and POST new blog
router.route('/')
  .get(getBlogs)
  .post(createBlog);

// Routes mapping for GET single blog, PUT update, and DELETE blog by ID
router.route('/:id')
  .get(getBlogById)
  .put(updateBlog)
  .delete(deleteBlog);

module.exports = router;
