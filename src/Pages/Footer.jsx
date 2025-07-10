import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Instagram, Facebook, Twitter, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-12 left-8 w-24 h-24 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-12 right-8 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            RentNest
          </h2>
          <p className="text-gray-300 text-sm">Your perfect home rental platform.</p>
          <div className="flex space-x-3 mt-3">
            {/* External social links remain a tags */}
            <a href="https://instagram.com/rentnest" aria-label="Instagram" className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-110 transition-transform" target="_blank" rel="noreferrer">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com/rentnest" aria-label="Facebook" className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-110 transition-transform" target="_blank" rel="noreferrer">
              <Facebook size={18} />
            </a>
            {/* <a href="https://twitter.com/rentnest" aria-label="Twitter" className="p-2 rounded-lg bg-gradient-to-r from-gray-800 to-black hover:scale-110 transition-transform" target="_blank" rel="noreferrer">
              <Twitter size={18} />
            </a> */}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <div className="flex items-center space-x-3 text-sm mb-2">
            <Phone size={16} className="text-blue-400" />
            <span>+91 9072276965</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Mail size={16} className="text-purple-400" />
            <span>hello@rentnest.com</span>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="font-semibold mb-2">Location</h3>
          <div className="flex items-start space-x-3 text-sm">
            <MapPin size={16} className="text-pink-400 mt-1" />
            <address className="not-italic">
              123 Premium Plaza<br />
              Kanhangad, Kerala 671315<br />
              India
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-xs space-x-4">
        {/* Internal links replaced with Link */}
        <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300 hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms-of-service" className="hover:text-white transition-colors duration-300 hover:underline">
          Terms of Service
        </Link>
        <Link to="/support" className="hover:text-white transition-colors duration-300 hover:underline">
          Support
        </Link>
        <div className="mt-2 md:mt-0">© {new Date().getFullYear()} RentNest. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
