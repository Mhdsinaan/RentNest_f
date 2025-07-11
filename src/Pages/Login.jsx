import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../Api/Api';
import { toast } from 'sonner';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      toast.error('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/api/Auth/login', { email, password });
      const { data } = response.data;

      const user = {
        token: data.token,
        username: data.username,
        role: data.role,
        email,
      };

      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful!');

      switch (data.role) {
        case 'admin':
          navigate('/AdminDashboard');
          break;
        case 'owner':
          navigate('/OwnerDashboard');
          break;
        default:
          navigate('/');
      }

    } catch (err) {
      console.error('Login error:', err);
      toast.error(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden transform transition-all hover:scale-[1.02] duration-300">

        {/* Left Side with Image and Text */}
        <div className=" md:flex  flex-col items-center justify-center bg-indigo  p-10 ">
  <img
    src="https://i.pinimg.com/1200x/ec/65/99/ec65999b536945fabdba1b2a7444e098.jpg"
    alt="Rental"
    className="w-full h-64 object-cover rounded-lg shadow-md"
  />
</div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>

            {/* Signup Link */}
            <div className="text-center">
              <Link
                to="/signup"
                className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
