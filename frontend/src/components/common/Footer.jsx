import React from 'react';
import { Briefcase, Heart, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                OpportunityHub
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A full-stack career platform connecting aspiring candidates with industry-leading jobs and internships.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              For Candidates
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/jobs" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=internship" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Student Internships
                </Link>
              </li>
              <li>
                <Link to="/jobs?workMode=remote" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Remote Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/register" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Recruiter Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Viva & Project Tech Specs */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              Project Architecture
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
              MERN Stack • JWT + RBAC • Helmet & MongoSanitize Security • Multer Uploads • MongoDB Atlas Aggregations.
            </p>
            <div className="flex items-center space-x-3 text-gray-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-700 dark:hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-gray-700 dark:hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} OpportunityHub. Full Stack College Capstone Project.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Crafted with React, Node.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
