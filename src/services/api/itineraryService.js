import { delay } from '../index'
import itinerariesData from '../mockData/itineraries.json'

class ItineraryService {
  constructor() {
    this.itineraries = [...itinerariesData]
  }

  async getAll() {
    await delay(300)
    return [...this.itineraries]
  }

  async getById(id) {
    await delay(200)
    const itinerary = this.itineraries.find(itinerary => itinerary.id === id)
    if (!itinerary) {
      throw new Error('Itinerary not found')
    }
    return { ...itinerary }
  }

  async getByTripId(tripId) {
    await delay(300)
    const itinerary = this.itineraries.find(itinerary => itinerary.tripId === tripId)
    if (!itinerary) {
      // Generate a basic itinerary if none exists
      return this.generateItinerary(tripId)
    }
    return { ...itinerary }
  }

  async generateItinerary(tripId) {
    await delay(500)
    const newItinerary = {
      id: `itinerary_${Date.now()}`,
      tripId,
      status: 'draft',
      totalCost: 2850,
      days: [
        {
          date: new Date().toISOString().split('T')[0],
          description: 'Arrival and City Exploration',
          estimatedCost: 285,
          activities: [
            {
              id: `activity_${Date.now()}_1`,
              name: 'Airport Transfer',
              type: 'transport',
              startTime: '10:00',
              duration: 45,
              cost: 35,
              location: {
                address: 'City Airport to Downtown Hotel',
                lat: 40.7128,
                lng: -74.0060
              },
              description: 'Private car transfer from airport',
              completed: false
            },
            {
              id: `activity_${Date.now()}_2`,
              name: 'Hotel Check-in',
              type: 'hotel',
              startTime: '11:30',
              duration: 30,
              cost: 0,
              location: {
                address: 'Downtown Boutique Hotel',
                lat: 40.7589,
                lng: -73.9851
              },
              description: 'Check into your centrally located hotel',
              completed: false
            },
            {
              id: `activity_${Date.now()}_3`,
              name: 'City Walking Tour',
              type: 'attraction',
              startTime: '14:00',
              duration: 180,
              cost: 25,
              location: {
                address: 'Historic City Center',
                lat: 40.7505,
                lng: -73.9934
              },
              description: 'Guided walking tour of the historic district',
              completed: false
            },
            {
              id: `activity_${Date.now()}_4`,
              name: 'Welcome Dinner',
              type: 'dining',
              startTime: '19:00',
              duration: 120,
              cost: 85,
              location: {
                address: 'Local Cuisine Restaurant',
                lat: 40.7614,
                lng: -73.9776
              },
              description: 'Traditional local cuisine with city views',
              completed: false
            }
          ]
        }
      ]
    }
    this.itineraries.push(newItinerary)
    return { ...newItinerary }
  }

  async create(itineraryData) {
    await delay(400)
    const newItinerary = {
      id: `itinerary_${Date.now()}`,
      ...itineraryData,
      createdAt: new Date().toISOString()
    }
    this.itineraries.push(newItinerary)
    return { ...newItinerary }
  }

  async update(id, data) {
    await delay(300)
    const index = this.itineraries.findIndex(itinerary => itinerary.id === id)
    if (index === -1) {
      throw new Error('Itinerary not found')
    }
    this.itineraries[index] = { ...this.itineraries[index], ...data }
    return { ...this.itineraries[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.itineraries.findIndex(itinerary => itinerary.id === id)
    if (index === -1) {
      throw new Error('Itinerary not found')
    }
    this.itineraries.splice(index, 1)
    return true
  }
}

export default new ItineraryService()