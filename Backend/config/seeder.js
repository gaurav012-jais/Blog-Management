const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('../models/Blog');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Sample Blog data
const sampleBlogs = [
  {
    title: 'Getting Started with the MERN Stack',
    author: 'Alex River',
    content: 'The MERN stack (MongoDB, Express, React, Node.js) is one of the most popular technology stacks for building modern, full-stack web applications. In this guide, we explore the core components of the MERN stack, how they communicate via clean JSON REST APIs, and why Mongoose is a great ODM choice. We will also discuss folder structures and project setups that scale effectively from simple prototypes to high-performance production apps.',
  },
  {
    title: 'The Art of Clean Styling with Tailwind CSS',
    author: 'Sophia Chen',
    content: 'Tailwind CSS has completely revolutionized the way frontend developers write styles. By providing highly cohesive low-level utility classes directly inside your HTML or JSX, it allows for extremely fast iterations without bloated CSS files. In this post, we learn how to create premium designs, custom grid systems, dark mode classes, transitions, and dynamic card overlays, all while keeping utility classes semantic, responsive, and organized.',
  },
  {
    title: 'Mastering Async Javascript and Error Midllewares',
    author: 'James Vance',
    content: 'Writing robust backend code requires excellent handling of asynchronous operations and potential failures. Express.js error-handling middlewares enable developers to capture routing errors, CastError issues, database validation discrepancies, and generic server crashes in a unified central mechanism. This ensures the client always receives structured JSON and clean status codes rather than messy stack traces, leading to superior API reliability.',
  },
];

// Seed Function
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Blog.deleteMany();
    console.log('Existing blogs cleared.');

    // Seed sample blogs
    await Blog.insertMany(sampleBlogs);
    console.log('Sample data seeded successfully!');

    // Close Connection
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

// If run directly in terminal
if (require.main === module) {
  seedData();
}

module.exports = seedData;
