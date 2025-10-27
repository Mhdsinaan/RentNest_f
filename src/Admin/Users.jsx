import React, { useEffect, useState } from 'react'
import { Users as UsersIcon, Mail, Shield, Hash, Search, Filter } from 'lucide-react'
import api from '../../Api/Api' // Your axios instance

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await api.get('/api/Auth/all-users')
        setUsers(response.data.data || [])
        console.log(response.data.data);
        
      } catch (err) {
        setError('Failed to fetch users')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-semibold text-slate-600">Loading users...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-lg font-semibold text-red-800">{error}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      case 'user':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'moderator':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800">
                Users Management
              </h2>
              <p className="text-slate-600 text-lg font-medium mt-1">
                Manage and view all registered users
              </p>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{users.length}</p>
                  <p className="text-slate-600 font-medium">Total Users</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Active System Users</p>
              </div>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-xl">
              <UsersIcon className="w-20 h-20 text-slate-400 mx-auto mb-4" />
              <p className="text-2xl font-semibold text-slate-600 mb-2">No users found</p>
              <p className="text-slate-500">There are currently no users in the system.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <UsersIcon className="w-6 h-6" />
                Users Directory
              </h3>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-200">
                    <th className="px-8 py-6 text-left">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wider">
                        <Hash className="w-4 h-4" />
                        ID
                      </div>
                    </th>
                    <th className="px-8 py-6 text-left">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wider">
                        <UsersIcon className="w-4 h-4" />
                        Username
                      </div>
                    </th>
                    <th className="px-8 py-6 text-left">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wider">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </th>
                    <th className="px-8 py-6 text-left">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wider">
                        <Shield className="w-4 h-4" />
                        Role
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(({ userId, userName, eMail, role }, index) => (
                    <tr 
                      key={userId} 
                      className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 hover:shadow-md"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {userId}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {userName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-lg">{userName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700 font-medium">{eMail}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getRoleBadgeColor(role)}`}>
                          <Shield className="w-4 h-4" />
                          {role?.charAt(0)?.toUpperCase() + role?.slice(1)?.toLowerCase() || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Showing {users.length} users</span>
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users