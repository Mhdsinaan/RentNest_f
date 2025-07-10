import React, { useState } from 'react';
import { Menu, X, Home, Building, User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [item, search] = useState('');

  const navLinks = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'List your Properties', to: '/createRequest', icon: Building },
    { name: 'Properties', to: '/PropertyList', icon: Mail },
    { name: 'SignUp', to: '/Login', icon: User },
   
  ];

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="relative group cursor-pointer">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Rent<span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Nest</span>
              </div>
            </div>

       
            <nav className="hidden md:flex items-center space-x-4">
              
             
              

              
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="group relative px-4 py-2 rounded-xl text-red hover:text-blue-400 transition-all duration-300 font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span>{link.name}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl opacity-0 group-hover:opacity-30 transition-all duration-300 -z-10"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-3/4 transition-all duration-300"></div>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Toggle */}
            <button
              className="md:hidden relative p-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:scale-110"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X size={24} className="text-white transition-transform duration-300 rotate-90" />
              ) : (
                <Menu size={24} className="text-white transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full transition-all duration-500 transform ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-white/95 backdrop-blur-xl border-t border-white shadow-2xl mx-4 mt-2 rounded-2xl overflow-hidden">
            <div className="p-6 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="group flex items-center space-x-3 p-4 rounded-xl text-white-700 hover:text-blue-600 transition-all duration-300 font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg">{link.name}</span>
                    <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
