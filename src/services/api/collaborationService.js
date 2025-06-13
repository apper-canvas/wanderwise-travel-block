import { delay } from '../index'
import votesData from '../mockData/votes.json'

class CollaborationService {
  constructor() {
    this.votes = [...votesData]
  }

  async getVotes(tripId) {
    await delay(300)
    const tripVotes = this.votes.filter(vote => vote.tripId === tripId)
    return [...tripVotes]
  }

  async createVote(voteData) {
    await delay(400)
    const newVote = {
      id: `vote_${Date.now()}`,
      ...voteData,
      votes: voteData.options.reduce((acc, option) => {
        acc[option] = 0
        return acc
      }, {}),
      createdAt: new Date().toLocaleDateString(),
      userVote: null
    }
    this.votes.unshift(newVote)
    return { ...newVote }
  }

  async vote(voteId, option) {
    await delay(300)
    const voteIndex = this.votes.findIndex(vote => vote.id === voteId)
    if (voteIndex === -1) {
      throw new Error('Vote not found')
    }
    
    const vote = this.votes[voteIndex]
    if (vote.userVote) {
      throw new Error('You have already voted')
    }
    
    vote.userVote = option
    vote.votes[option] = (vote.votes[option] || 0) + 1
    
    return { ...vote }
  }

  async inviteMember(tripId, email) {
    await delay(400)
    
    // Simulate sending invitation
    return {
      tripId,
      email,
      invitationId: `invitation_${Date.now()}`,
      status: 'sent',
      sentAt: new Date().toISOString()
    }
  }

  async getMembers(tripId) {
    await delay(300)
    
    // Mock members data
    return [
      {
        id: 'user1',
        name: 'You',
        email: 'you@example.com',
        role: 'organizer',
        joinedAt: '2024-01-01'
      },
      {
        id: 'user2',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        role: 'member',
        joinedAt: '2024-01-05'
      },
      {
        id: 'user3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'member',
        joinedAt: '2024-01-10'
      }
    ]
  }
}

export default new CollaborationService()