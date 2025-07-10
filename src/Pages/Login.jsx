import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Api/Api';
import { toast } from 'sonner';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/api/Auth/login', {
        email: form.email.trim(),
        password: form.password,
      });

      const { data, message } = response.data;

      const user = {
        token: data.token,
        username: data.username,
        role: data.role,
        email: form.email.trim(),
      };
      localStorage.setItem('user', JSON.stringify(user));
    //   localStorage.setItem('user');  


      toast.success(message || 'Login successful!');
      setUserData(user);
      setIsLoggedIn(true);

      if(user.role=="admin"){
        navigate('/AdminDashboard'); 

      }else{
        navigate('/'); 

      }

      
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Login failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setForm({ email: '', password: '' });
    toast.info('Logged out successfully.');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
         
          {isLoggedIn ? userData?.username : 'Login'}
        </h2>

        {isLoggedIn && userData ? (
          <div className="space-y-4 text-center">
            
            {/* <p className="text-lg font-semibold text-gray-700">{userData.username}</p> */}
            <p className="text-sm text-gray-600">Email: {userData.email}</p>
            <p className="text-sm text-gray-600">Role: {userData.role}</p>

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {!isLoggedIn && (
          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
