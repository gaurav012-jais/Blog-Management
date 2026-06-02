import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              BlogFlow
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} BlogFlow Manager. Production Ready & Elegant.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="hover:text-indigo-500 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-500 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
