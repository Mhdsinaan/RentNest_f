import React, { useContext, useEffect, useState } from 'react'
import { Home, BarChart3, Users, Wrench, FileText, LogOut } from 'lucide-react'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { DataContext } from '../Context/DataContext'
import api from '../../Api/Api'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { properties } = useContext(DataContext)
  const [loading, setLoading] = useState(true)

  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])

  const navItems = [
    { name: 'Dashboard', icon: Home, to: '/AdminDashboard' },
    { name: 'Analytics', icon: BarChart3, to: '/AdminDashboard/analytics' },
    { name: 'Users', icon: Users, to: '/AdminDashboard/users' },
    { name: 'Maintenance', icon: Wrench, to: '/AdminDashboard/maintenance' },
    { name: 'Applications', icon: FileText, to: '/AdminDashboard/AllRequests' },
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        const usersResponse = await api.get('/api/Auth/all-users')
        setUsers(usersResponse.data.data || [])

        const bookingsResponse = await api.get('/api/Booking/GetAll')
        setBookings(bookingsResponse.data.data || [])

        setTimeout(() => setLoading(false), 1000)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const chartData = [
    { name: 'Users', count: users.length },
    { name: 'Properties', count: properties?.length || 0 },
    { name: 'Bookings', count: bookings.length },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
        
        <div className="p-8 relative z-10">
          {/* Logo */}
          <div className="flex items-center mb-12 cursor-pointer group">
            <div className="relative">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent select-none group-hover:scale-105 transition-transform duration-300">
                Rent
                <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Nest
                </span>
              </h1>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to
              return (
                <Link to={item.to} key={index} className="block">
                  <div
                    className={`flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                        : 'text-slate-700 hover:bg-white/70 hover:text-slate-900 hover:shadow-md hover:scale-102'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90"></div>
                    )}
                    <Icon className={`w-6 h-6 mr-4 relative z-10 transition-transform duration-300 ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
                    <span className={`font-semibold relative z-10 ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-8 border-t border-slate-200/50 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 group hover:shadow-lg hover:shadow-red-500/25 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <LogOut className="w-6 h-6 mr-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold relative z-10">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="h-80 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-2xl animate-pulse shadow-xl"></div>
        ) : location.pathname === '/AdminDashboard' ? (
          <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 mb-4">
                Welcome to Admin Dashboard
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {/* Count Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Total Properties</h3>
                  <p className="text-5xl font-black text-blue-600 group-hover:scale-105 transition-transform duration-300">
                    {properties?.length || 0}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Total Users</h3>
                  <p className="text-5xl font-black text-emerald-600 group-hover:scale-105 transition-transform duration-300">
                    {users.length}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Total Bookings</h3>
                  <p className="text-5xl font-black text-amber-600 group-hover:scale-105 transition-transform duration-300">
                    {bookings.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Bar Chart */}
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Analytics Overview</h3>
              <div className="w-full h-96">
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 40, right: 40, left: 20, bottom: 20 }}
                    barCategoryGap="25%"
                  >
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#475569', fontSize: 16, fontWeight: 700 }}
                      axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                      tickLine={false}
                      padding={{ left: 30, right: 30 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#f8fafc',
                        fontSize: 16,
                        fontWeight: 600,
                        padding: '12px 16px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: [8, 8, 0, 0] }}
                    />

                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>

                    <Bar
                      dataKey="count"
                      fill="url(#barGradient)"
                      radius={[12, 12, 0, 0]}
                      barSize={60}
                    >
                      <LabelList
                        dataKey="count"
                        position="top"
                        fill="#1e293b"
                        fontWeight="800"
                        fontSize={18}
                        offset={10}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}

export default AdminDashboard