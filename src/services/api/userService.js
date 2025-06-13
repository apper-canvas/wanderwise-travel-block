import { delay } from '../index'
import userData from '../mockData/user.json'

class UserService {
  constructor() {
    this.user = { ...userData }
    this.preferences = {
      travelStyle: 'balanced',
      interests: ['culture', 'food', 'nature'],
      preferredCurrency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false
      }
    }
  }

  async getProfile() {
    await delay(300)
    return { ...this.user }
  }

  async updateProfile(profileData) {
    await delay(400)
    this.user = { ...this.user, ...profileData }
    return { ...this.user }
  }

  async getPreferences() {
    await delay(200)
    return { ...this.preferences }
  }

  async updatePreferences(preferencesData) {
    await delay(300)
    this.preferences = { ...this.preferences, ...preferencesData }
    return { ...this.preferences }
  }

  async uploadDocument(documentData) {
    await delay(500)
    const newDocument = {
      id: `doc_${Date.now()}`,
      ...documentData,
      uploadedAt: new Date().toISOString()
    }
    return newDocument
  }

  async getDocuments() {
    await delay(300)
    return [
      {
        id: 'doc1',
        name: 'Passport',
        type: 'passport',
        uploadedAt: '1/15/2024 10:30:00 AMZ',
        expiryDate: '2029-01-15'
      },
      {
        id: 'doc2',
        name: 'Driver License',
        type: 'license',
        uploadedAt: '2024-01-10T14:20:00Z',
        expiryDate: '2026-03-20'
      }
    ]
  }
}

export default new UserService()