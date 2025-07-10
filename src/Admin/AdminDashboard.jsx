import React, { useEffect, useState } from 'react'
import { Home, BarChart3, Users, Wrench, FileText, LogOut } from 'lucide-react'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', icon: Home, to: '/AdminDashboard' },
    { name: 'Analytics', icon: BarChart3, to: '/AdminDashboard/analytics' },
    { name: 'Users', icon: Users, to: '/AdminDashboard/users' },
    { name: 'Maintenance', icon: Wrench, to: '/AdminDashboard/maintenance' },
    { name: 'Applications', icon: FileText, to: '/AdminDashboard/AllRequests' }
  ]

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 1000)
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Rent<span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Nest</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to
              return (
                <Link to={item.to} key={index}>
                  <div
                    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {loading ? (
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ) : (
            <>
              {/* Default dashboard content if no nested route */}
              {location.pathname === '/AdminDashboard' ? (
                <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Admin</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Manage all users and roles</li>
                    <li>Approve or reject property listings</li>
                    <li>Monitor complaints and payment activities</li>
                    <li>Generate and review system reports</li>
                  </ul>
                </div>
              ) : (
                <Outlet /> // 👈 Shows nested route (like AllRequests)
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
