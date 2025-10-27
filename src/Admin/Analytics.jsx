import React, { useEffect, useState } from 'react'
import api from '../../Api/Api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const TotalRevenue = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch bookings and listing data
        const [bookingRes, listingRes] = await Promise.all([
          api.get('/api/Booking/GetAll'),
          api.get('/api/ListingRequest/GetAll')
        ])

        const bookingsData = bookingRes.data.data || []
        const listingsData = listingRes.data.data || []

        // Create a map of listingId => propertyName
        const listingMap = {}
        listingsData.forEach((listing) => {
          listingMap[listing.id] = listing.propertyName || `Listing #${listing.id}`
        })

        // Enrich bookings with property name (replace listingId with propertyName)
        const enrichedBookings = bookingsData.map((booking) => ({
          ...booking,
          propertyName: listingMap[booking.listingRequestId] || `Listing #${booking.listingRequestId}`
        }))

        setBookings(enrichedBookings)
      } catch (err) {
        console.error(err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate total revenue
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)

  // Group by property name (not ID)
  const revenueByProperty = bookings.reduce((acc, booking) => {
    const name = booking.propertyName
    if (!acc[name]) {
      acc[name] = { name, revenue: 0 }
    }
    acc[name].revenue += booking.totalAmount || 0
    return acc
  }, {})

  const chartData = Object.values(revenueByProperty)

  if (loading) return <p className="p-4 text-center">Loading revenue...</p>
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Total Revenue</h2>
      <p className="text-4xl font-bold text-green-600 text-center mb-6">
        ${totalRevenue.toLocaleString()}
      </p>

      <h3 className="text-xl font-medium mb-4">Revenue by Property Name</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TotalRevenue
