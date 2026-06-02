import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Calendar, User, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog, onDeleteClick }) => {
  // Helper to generate a clean author initials avatar with an elegant color gradient
  const getAvatarDetails = (name) => {
    if (!name) return { text: 'A', bg: 'from-blue-500 to-indigo-500' };
    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Choose gradient based on first character
    const charCode = name.charCodeAt(0) || 0;
    const gradients = [
      'from-rose-500 to-orange-500',
      'from-amber-500 to-yellow-500',
      'from-emerald-500 to-teal-500',
      'from-cyan-500 to-blue-500',
      'from-indigo-500 to-purple-500',
      'from-fuchsia-500 to-pink-500',
    ];
    const bg = gradients[charCode % gradients.length];
    return { text: initials, bg };
  };

  // Helper to format date cleanly
  const formatDate = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Recent';
    }
  };

  // Calculate an approximate read time based on 200 words per minute
  const getReadTime = (text) => {
    if (!text) return '1 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const { text: initials, bg: avatarBg } = getAvatarDetails(blog.author);

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1.5">
      {/* Blog Card Content Header */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <span className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
            {getReadTime(blog.content)}
          </span>
          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <time>{formatDate(blog.createdAt)}</time>
          </div>
        </div>

        {/* Title */}
        <Link to={`/blogs/${blog._id}`} className="block mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt Content */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {blog.content}
        </p>

        {/* Card Footer containing Author Badge and Action Controls */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {/* Author info with colored Initials Badge */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0`}>
              {initials}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
              {blog.author}
            </span>
          </div>

          {/* Action buttons (Read, Edit, Delete) */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Link
              to={`/blogs/${blog._id}`}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="View full post"
            >
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>

            <Link
              to={`/edit/${blog._id}`}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors"
              title="Edit Blog"
            >
              <Edit className="h-4.5 w-4.5" />
            </Link>

            <button
              onClick={() => onDeleteClick(blog)}
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
              title="Delete Blog"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
