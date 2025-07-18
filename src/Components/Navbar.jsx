import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Building, User, Mail, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // State for both mobile and desktop user dropdown
  const [hideNav, setHideNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const userMenuRef = useRef(null); // Ref to detect outside clicks for desktop dropdown

  const navLinks = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'List your Properties', to: '/createRequest', icon: Building },
    { name: 'Properties', to: '/PropertyList', icon: Mail },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/Login';
  };

  // Detect scroll direction and position
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHideNav(currentY > lastY && currentY > 80);
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (menuOpen && !event.target.closest('.mobile-nav') && !event.target.closest('.mobile-toggle')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Check if on home page
  const isHome = location.pathname === '/';

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          hideNav ? '-translate-y-full' : 'translate-y-0'
        } ${
          isHome && !scrolled
            ? 'bg-transparent backdrop-blur-md'
            : 'bg-white shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
            >
              Rent
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Nest
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map(({ name, to, icon: Icon }) => (
                <Link
                  key={name}
                  to={to}
                  className="group relative px-4 py-2 rounded-xl text-red hover:text-blue-500 transition font-medium"
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>{name}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-3/4 transition-all duration-300"></div>
                </Link>
              ))}

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:text-blue-500 transition"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <User size={18} />
                    <span>{user.username}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg text-sm text-gray-800 transition-all duration-300 ${
                      userMenuOpen
                        ? 'opacity-100 max-h-60'
                        : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                  >
                    <Link
                      to="/MyBookings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/Profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Details
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/Login"
                  className="px-4 py-2 rounded-xl text-red hover:text-blue-400 font-medium"
                >
                  <User size={18} className="inline-block mr-1" />
                  SignUp
                </Link>
              )}
            </nav>

            {/* Mobile Toggle */}
            <button
              className="md:hidden relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`md:hidden absolute top-full left-0 w-full transition-all duration-500 mobile-nav ${
            menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-white shadow-2xl mx-4 mt-2 rounded-2xl overflow-hidden">
            <div className="p-6 space-y-2">
              {navLinks.map(({ name, to, icon: Icon }) => (
                <Link
                  key={name}
                  to={to}
                  className="group flex items-center space-x-3 p-4 rounded-xl text-gray-700 hover:text-blue-600 transition font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span className="text-lg">{name}</span>
                </Link>
              ))}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="group flex items-center space-x-3 p-4 rounded-xl text-gray-700 hover:text-blue-600 transition font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 w-full"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <User size={20} />
                    <span className="text-lg">{user.username}</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`space-y-1 mt-1 transition-all duration-300 ${
                      userMenuOpen
                        ? 'opacity-100 max-h-60'
                        : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                  >
                    <Link
                      to="/MyBookings"
                      className="block px-4 py-2 pl-10 hover:bg-gray-100 text-gray-700 hover:text-blue-600"
                      onClick={() => {
                        setMenuOpen(false);
                        setUserMenuOpen(false);
                      }}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/Profile"
                      className="block px-4 py-2 pl-10 hover:bg-gray-100 text-gray-700 hover:text-blue-600"
                      onClick={() => {
                        setMenuOpen(false);
                        setUserMenuOpen(false);
                      }}
                    >
                      My Details
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 pl-10 hover:bg-gray-100 text-gray-700 hover:text-blue-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/Login"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  SignUp
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}