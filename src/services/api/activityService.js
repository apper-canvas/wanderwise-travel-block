import { delay } from '../index'
import activitiesData from '../mockData/activities.json'

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
  }

  async getAll() {
    await delay(300)
    return [...this.activities]
  }

  async getById(id) {
    await delay(200)
    const activity = this.activities.find(activity => activity.id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  }

  async getByTripId(tripId) {
    await delay(300)
    const tripActivities = this.activities.filter(activity => activity.tripId === tripId)
    return [...tripActivities]
  }

  async create(activityData) {
    await delay(400)
    const newActivity = {
      id: `activity_${Date.now()}`,
      ...activityData,
      createdAt: new Date().toISOString(),
      completed: false
    }
    this.activities.push(newActivity)
    return { ...newActivity }
  }

  async update(id, data) {
    await delay(300)
    const index = this.activities.findIndex(activity => activity.id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    this.activities[index] = { ...this.activities[index], ...data }
    return { ...this.activities[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.activities.findIndex(activity => activity.id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    this.activities.splice(index, 1)
    return true
  }
}

export default new ActivityService()