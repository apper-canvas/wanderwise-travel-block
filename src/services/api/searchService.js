import { delay } from '../index'
import searchResultsData from '../mockData/searchResults.json'

class SearchService {
  constructor() {
    this.searchResults = [...searchResultsData]
  }

  async search({ query, type = 'all', sortBy = 'relevance' }) {
    await delay(500)
    
    let results = [...this.searchResults]
    
    // Filter by query
    if (query) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    // Filter by type
    if (type !== 'all') {
      results = results.filter(item => item.type === type)
    }
    
    // Sort results
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'distance':
        results.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        break
      default:
        // Keep relevance order
        break
    }
    
    return results
  }

  async book(itemId) {
    await delay(400)
    const item = this.searchResults.find(item => item.id === itemId)
    if (!item) {
      throw new Error('Item not found')
    }
    
    // Simulate booking process
    return {
      bookingId: `booking_${Date.now()}`,
      itemId,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    }
  }

  async getRecommendations(preferences = {}) {
    await delay(300)
    
    // Simple recommendation based on type preference
    let recommendations = [...this.searchResults]
    
    if (preferences.type) {
      recommendations = recommendations.filter(item => item.type === preferences.type)
    }
    
    // Return top rated items
    return recommendations
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6)
  }
}

export default new SearchService()