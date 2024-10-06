import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="card-glass card-glass-footer mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">&copy; 2024 UX Design Blog. All rights reserved.</p>
          <div className="space-x-4">
            <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;