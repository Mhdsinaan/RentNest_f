import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Instagram, Facebook, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-blue-400 mb-2">RentNest</h2>
          <p className="text-gray-400">Your perfect home rental platform.</p>
          <div className="flex space-x-3 mt-3">
            <a href="https://instagram.com/rentnest" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://facebook.com/rentnest" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={16} />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <div className="flex items-center gap-2 mb-1 text-gray-300">
            <Phone size={14} />
            <span>+91 90722 76965</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Mail size={14} />
            <span>hello@rentnest.com</span>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="font-semibold mb-2">Location</h3>
          <div className="flex items-start gap-2 text-gray-300">
            <MapPin size={14} className="mt-1" />
            <address className="not-italic">
              123 Premium Plaza<br />
              Kanhangad, Kerala 671315
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-6 pt-3 border-t border-gray-700 text-center text-xs text-gray-400 space-x-3">
        <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
        <Link to="/terms-of-service" className="hover:underline">Terms</Link>
        <Link to="/support" className="hover:underline">Support</Link>
        <span className="block mt-2 md:mt-0">© {new Date().getFullYear()} RentNest</span>
      </div>
    </footer>
  );
};

export default Footer;
