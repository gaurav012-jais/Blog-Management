import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBlogById, deleteBlogPost } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Share2, 
  Check,
  AlertCircle
} from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals / Alerts state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  // Load specific blog
  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBlogById(id);
      setBlog(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch the blog post. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlog();
  }, [id]);

  // Handle toast notifications autohide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle Copy Article Link to Clipboard
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setToast({ type: 'success', text: 'Link copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle deletion confirmation click
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteBlogPost(id);
      setShowDeleteModal(false);
      navigate('/', { state: { message: 'Blog post deleted successfully!' } });
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Failed to delete the article.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for initials badge
  const getAvatarInitials = (name) => {
    if (!name) return 'A';
    return name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper for formatted date
  const formatDate = (dateStr) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Recent';
    }
  };

  // Calculate read time
  const getReadTime = (text) => {
    if (!text) return '1 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <LoadingSpinner type="skeleton-detail" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full flex items-center justify-center">
        <ErrorMessage 
          title="Failed to Load Article" 
          message={error || 'The requested article could not be found.'} 
          onRetry={loadBlog} 
        />
      </div>
    );
  }

  const initials = getAvatarInitials(blog.author);
  const readTime = getReadTime(blog.content);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full animate-fade-in transition-colors duration-300">
      {/* Toast Alert Banner */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-5 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all duration-300 transform scale-100 ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400'
            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400'
        }`}>
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Return to Dashboard and share control bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Share/Actions buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareClick}
            className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
            title="Copy post link"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main content paper */}
      <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        {/* Post Metadata details */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">
          <span className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
            <Clock className="h-3.5 w-3.5" />
            <span>{readTime}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(blog.createdAt)}</span>
          </span>
        </div>

        {/* Heading title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight mt-0 mb-6 break-words">
          {blog.title}
        </h1>

        {/* Author information header */}
        <div className="flex items-center justify-between pb-8 border-b border-slate-100 dark:border-slate-800 mb-8 gap-4 flex-wrap">
          <div className="flex items-center space-x-3.5">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              {initials}
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-none m-0">
                {blog.author}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1.5 m-0">
                Article Creator
              </p>
            </div>
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center space-x-2">
            <Link
              to={`/edit/${blog._id}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:border-indigo-950 dark:hover:bg-indigo-950/20 text-slate-655 hover:text-indigo-600 dark:text-black dark:hover:text-indigo-500 text-xs font-bold rounded-xl transition-all"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Article</span>
            </Link>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:border-rose-250 hover:bg-rose-50/50 dark:border-slate-700 dark:hover:border-rose-950 dark:hover:bg-rose-950/20 text-slate-655 hover:text-rose-600 dark:text-slate-355 dark:hover:text-rose-450 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words prose dark:prose-invert font-normal">
          {blog.content}
        </div>
      </article>

      {/* Delete confirmation Modal overlay */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete this article?"
        message={`Are you sure you want to delete "${blog.title}"? This will permanently remove the article and cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Post'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </main>
  );
};

export default BlogDetails;
