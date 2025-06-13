import { delay } from '../index'
import tripsData from '../mockData/trips.json'

class TripService {
  constructor() {
    this.trips = [...tripsData]
  }

  async getAll() {
    await delay(300)
    return [...this.trips]
  }

  async getById(id) {
    await delay(200)
    const trip = this.trips.find(trip => trip.id === id)
    if (!trip) {
      throw new Error('Trip not found')
    }
    return { ...trip }
  }

  async create(tripData) {
    await delay(400)
    const newTrip = {
      id: `trip_${Date.now()}`,
      ...tripData,
      status: 'upcoming',
      dateRange: `${tripData.startDate} - ${tripData.endDate}`,
      createdAt: new Date().toISOString(),
      spent: 0,
      members: [
        {
          id: 'user1',
          name: 'You',
          email: 'you@example.com',
          role: 'organizer'
        }
      ]
    }
    this.trips.unshift(newTrip)
    return { ...newTrip }
  }

  async update(id, data) {
    await delay(300)
    const index = this.trips.findIndex(trip => trip.id === id)
    if (index === -1) {
      throw new Error('Trip not found')
    }
    this.trips[index] = { ...this.trips[index], ...data }
    return { ...this.trips[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.trips.findIndex(trip => trip.id === id)
    if (index === -1) {
      throw new Error('Trip not found')
    }
    this.trips.splice(index, 1)
    return true
  }
}

export default new TripService()