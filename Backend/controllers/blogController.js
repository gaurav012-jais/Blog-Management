const Blog = require('../models/Blog');

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
const getBlogs = async (req, res, next) => {
  try {
    // Sort by newest first
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error(`Blog with ID ${req.params.id} not found`);
    }

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new blog
 * @route   POST /api/blogs
 * @access  Public
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, content, author } = req.body;

    // Simple validation (redundant to Mongoose but clean)
    if (!title || !content || !author) {
      res.status(400);
      throw new Error('Please include a title, content, and author');
    }

    const blog = await Blog.create({
      title,
      content,
      author,
    });

    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing blog
 * @route   PUT /api/blogs/:id
 * @access  Public
 */
const updateBlog = async (req, res, next) => {
  try {
    const { title, content, author } = req.body;

    // First find if the blog exists
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error(`Blog with ID ${req.params.id} not found`);
    }

    // Update using findByIdAndUpdate to trigger validation and get new doc
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a blog
 * @route   DELETE /api/blogs/:id
 * @access  Public
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error(`Blog with ID ${req.params.id} not found`);
    }

    await blog.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
