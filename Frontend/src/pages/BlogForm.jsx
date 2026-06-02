import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBlogById, createBlogPost, updateBlogPost } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Edit3, 
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react';

const BlogForm = () => {
  const { id } = useParams(); // If present, we are in Edit Mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
  });

  // UI State
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const blog = await fetchBlogById(id);
        setFormData({
          title: blog.title || '',
          author: blog.author || '',
          content: blog.content || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch the blog details for editing.');
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id, isEditMode]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Form validations
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.author.trim()) {
      errors.author = 'Author name is required';
    } else if (formData.author.trim().length > 50) {
      errors.author = 'Author name cannot exceed 50 characters';
    }

    if (!formData.content.trim()) {
      errors.content = 'Blog content is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      if (isEditMode) {
        await updateBlogPost(id, formData);
        navigate(`/blogs/${id}`);
      } else {
        await createBlogPost(formData);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to save the blog post. Please check inputs.');
      setSubmitting(false);
    }
  };

  // Word Counter logic
  const getWordCount = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Calculate read time
  const getReadTime = (text) => {
    const words = getWordCount(text);
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

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full animate-fade-in transition-colors duration-300">
      {/* Return to Dashboard shortcut */}
      <div className="mb-6">
        <Link
          to={isEditMode ? `/blogs/${id}` : '/'}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isEditMode ? 'Back to Post' : 'Back to Dashboard'}</span>
        </Link>
      </div>

      {/* Main Form container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Card Header & Tab Buttons */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight m-0">
              {isEditMode ? 'Edit Blog Post' : 'Compose New Article'}
            </h1>
            <p className="text-red-600 dark:text-slate-400 text-xs mt-1">
              {isEditMode ? 'Update details of your existing publication' : 'Draft a new interesting article for your readers'}
            </p>
          </div>

          {/* Form / Preview Tabs Switch */}
          <div className="flex bg-slate-200/60 dark:bg-slate-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-black shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-black shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-6 border-b border-rose-100 dark:border-rose-950/20 bg-rose-50/30 dark:bg-rose-950/10">
            <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-450 text-sm font-semibold">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Tab 1: Edit Form */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title field */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Article Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="Enter a catchy title..."
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none ${
                  validationErrors.title
                    ? 'border-rose-350 dark:border-rose-900/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  {validationErrors.title}
                </span>
                <span className="text-slate-400 font-medium">
                  {formData.title.length}/100 characters
                </span>
              </div>
            </div>

            {/* Author field */}
            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Author Name
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                maxLength={50}
                placeholder="Your name or pseudonym..."
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none ${
                  validationErrors.author
                    ? 'border-rose-350 dark:border-rose-900/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  {validationErrors.author}
                </span>
                <span className="text-slate-400 font-medium">
                  {formData.author.length}/50 characters
                </span>
              </div>
            </div>

            {/* Content field */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article body here... Use markdown or plain text."
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none resize-y ${
                  validationErrors.content
                    ? 'border-rose-350 dark:border-rose-900/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              ></textarea>
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  {validationErrors.content}
                </span>
                <span className="text-slate-400 font-medium flex items-center space-x-3">
                  <span>{getWordCount(formData.content)} words</span>
                  <span>•</span>
                  <span>{formData.content.length} characters</span>
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
              <Link
                to={isEditMode ? `/blogs/${id}` : '/'}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-755 dark:text-slate-355 text-sm font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center space-x-2 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
              >
                <Save className="h-4.5 w-4.5" />
                <span>{submitting ? 'Saving...' : 'Publish Post'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Live Preview */}
        {activeTab === 'preview' && (
          <div className="p-8 space-y-6 animate-fade-in">
            {formData.title || formData.author || formData.content ? (
              <article className="prose max-w-none dark:prose-invert">
                {/* Meta details */}
                <div className="flex flex-wrap items-center space-x-4 text-xs font-semibold text-slate-400 mb-2">
                  <span className="flex items-center space-x-1.5 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getReadTime(formData.content)}</span>
                  </span>
                  <span>Draft Preview</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mt-0 mb-4 break-words">
                  {formData.title || 'Untitled Article'}
                </h1>

                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {formData.author ? formData.author.trim().slice(0, 2).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-850 dark:text-slate-205 m-0 leading-none">
                      {formData.author || 'Anonymous Writer'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium m-0 mt-1">
                      Author Profile
                    </p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="text-slate-700 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap break-words min-h-[150px]">
                  {formData.content || (
                    <p className="italic text-slate-400">
                      Start writing content in the 'Edit' tab to preview it here...
                    </p>
                  )}
                </div>
              </article>
            ) : (
              <div className="py-16 text-center text-slate-400 max-w-sm mx-auto">
                <BookOpen className="h-10 w-10 text-slate-350 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-medium">
                  Your live preview is empty. Enter some information in the editor fields!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogForm;
