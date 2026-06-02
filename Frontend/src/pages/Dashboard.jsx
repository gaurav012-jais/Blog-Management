import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, deleteBlogPost } from '../services/api';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  Search, 
  PlusCircle, 
  FileText, 
  Users, 
  PenTool, 
  FilterX, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Deletion Modal state
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch blogs
  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Handle toast notification auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    try {
      setIsDeleting(true);
      await deleteBlogPost(blogToDelete._id);
      
      // Update local state
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== blogToDelete._id));
      
      // Close modal and show success toast
      setBlogToDelete(null);
      setToastMessage({ type: 'success', text: 'Blog post deleted successfully!' });
    } catch (err) {
      setToastMessage({ type: 'error', text: err.message || 'Failed to delete blog.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter blogs based on search query in real-time
  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    const query = searchQuery.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.author.toLowerCase().includes(query)
    );
  }, [blogs, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = blogs.length;
    const uniqueAuthors = new Set(blogs.map((b) => b.author.trim().toLowerCase())).size;
    const wordCount = blogs.reduce((acc, curr) => acc + (curr.content ? curr.content.split(/\s+/).length : 0), 0);
    const avgWords = total > 0 ? Math.round(wordCount / total) : 0;
    
    return { total, uniqueAuthors, avgWords };
  }, [blogs]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Skeleton */}
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mb-4 animate-pulse"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mb-8 animate-pulse"></div>
        {/* Skeleton Grid */}
        <LoadingSpinner type="skeleton-grid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex items-center justify-center">
        <ErrorMessage 
          title="Server Connection Error" 
          message={error} 
          onRetry={loadBlogs} 
        />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in transition-colors duration-300">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-5 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all duration-300 transform scale-100 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400'
            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400'
        }`}>
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Welcome & Action Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight m-0 mb-1">
            Blog Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your articles, monitor metrics, and compose new publications.
          </p>
        </div>
        
        <Link
          to="/create"
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Write New Post</span>
        </Link>
      </div>

      {/* Metrics Banner Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Articles
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats.total}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Authors
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats.uniqueAuthors}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-xl">
            <PenTool className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg. Length
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats.avgWords} <span className="text-xs text-slate-400 font-normal">words</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Filtering Search Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center mb-8 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by article title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      {/* Blogs Grid Rendering */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="animate-slide-up">
              <BlogCard
                blog={blog}
                onDeleteClick={(blogObj) => setBlogToDelete(blogObj)}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty States */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full">
              <FilterX className="h-10 w-10" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {blogs.length === 0 ? 'No Articles Yet' : 'No Matches Found'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            {blogs.length === 0
              ? 'Be the first to share your thoughts! Start creating a gorgeous publication right now.'
              : `We couldn't find any results matching "${searchQuery}". Double-check spelling or try terms.`}
          </p>
          {blogs.length === 0 ? (
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>Create First Post</span>
            </Link>
          ) : (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Clear Search Query
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal Overlay */}
      <ConfirmationModal
        isOpen={!!blogToDelete}
        title="Delete Blog Post?"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This will permanently remove it from the system.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBlogToDelete(null)}
      />
    </main>
  );
};

export default Dashboard;
