import axios from "axios";

// Get API base URL from Vite environment variables or default to local backend port 5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Custom error extractor to parse and formats backend validation and error messages.
 */
const formatError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || "Something went wrong. Please try again.";
};

/**
 * Fetch all blogs.
 */
export const fetchBlogs = async () => {
  try {
    const response = await api.get("/blogs");
    return response.data;
  } catch (error) {
    throw new Error(formatError(error));
  }
};

/**
 * Fetch a single blog by its ID.
 */
export const fetchBlogById = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(formatError(error));
  }
};

/**
 * Create a new blog post.
 */
export const createBlogPost = async (blogData) => {
  try {
    const response = await api.post("/blogs", blogData);
    return response.data;
  } catch (error) {
    throw new Error(formatError(error));
  }
};

/**
 * Update an existing blog post.
 */
export const updateBlogPost = async (id, blogData) => {
  try {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    throw new Error(formatError(error));
  }
};

/**
 * Delete a blog post.
 */
export const deleteBlogPost = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(formatError(error));
  }
};

export default api;
