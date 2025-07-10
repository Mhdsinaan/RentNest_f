  import React, { useState } from 'react';
  import api from '../../Api/Api'; 
  import { toast } from 'sonner';
  import { Link, Navigate, useNavigate } from 'react-router-dom';

  export default function Registration() {
    const navigate=useNavigate();
    const [form, setForm] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      console.log(`Input changed: ${e.target.name} = ${e.target.value}`);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      setError(null);
      setSuccess(null);

      console.log('Form submitted with:', form);

    
      if (!form.username || !form.email || !form.password || !form.confirmPassword) {
        toast.error('Please fill in all fields.');
        // console.warn('Validation failed: missing fields');
        return;
      }

      if (!/\S+@\S+\.\S+/.test(form.email)) {
        toast.error('Please enter a valid email address.');
        // console.warn('Validation failed: invalid email format');
        return;
      }

      if (form.username.trim().length < 3) {
        toast.error('Username must be at least 3 characters long.');
        return;
      }

      if (form.password.length < 6) {
        toast.error('Password must be at least 6 characters.');
        return;
      }

      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match.');
        // console.warn('Validation failed: passwords do not match');
        return;
      }

      setLoading(true);

      try {
        const payload = {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        };

        // console.log('Sending registration payload:', payload);

        const response = await api.post('/api/Auth/register', payload);

        console.log('Registration successful:', response.data);
        toast.success(response.data.message || "Registration successful!");
         navigate('/Login');


        setSuccess(response.data.message );
        setForm({ username: '', email: '', password: '', confirmPassword: '' });
      } catch (err) {
        // console.error('Registration error response:', err.response);
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else if (err.response && err.response.data) {
          toast.error(JSON.stringify(err.response.data));
        } else {
          toast.error('Network error: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">{error}</div>
        )}

        {success && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 rounded">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className='flex justify-center'>
        <p><Link to={'/Login'} className='text-blue-600 font-semibold text-center'>you have an account</Link></p>
      </div>
      </div>
    );
  }
