import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import BlogDetails from './pages/BlogDetails';
import BlogForm from './pages/BlogForm';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Pages Layout */}
      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/edit/:id" element={<BlogForm />} />
        </Routes>
      </div>

      {/* Footer Branding */}
      <Footer />
    </div>
  );
}

export default App;
