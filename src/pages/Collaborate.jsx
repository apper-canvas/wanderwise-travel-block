import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { tripService, collaborationService } from '../services'

const Collaborate = () => {
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const tripsData = await tripService.getAll()
        const collaborativeTrips = tripsData.filter(trip => trip.members.length > 1)
        setTrips(collaborativeTrips)
        if (collaborativeTrips.length > 0) {
          setSelectedTrip(collaborativeTrips[0])
          const votesData = await collaborationService.getVotes(collaborativeTrips[0].id)
          setVotes(votesData)
        }
      } catch (err) {
        setError(err.message || 'Failed to load collaboration data')
        toast.error('Failed to load collaboration data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleTripChange = async (tripId) => {
    const trip = trips.find(t => t.id === tripId)
    setSelectedTrip(trip)
    try {
      const votesData = await collaborationService.getVotes(tripId)
      setVotes(votesData)
    } catch (err) {
      toast.error('Failed to load votes')
    }
  }

  const handleVote = async (voteId, option) => {
    try {
      await collaborationService.vote(voteId, option)
      setVotes(prev => prev.map(vote => 
        vote.id === voteId 
          ? { ...vote, userVote: option, votes: { ...vote.votes, [option]: (vote.votes[option] || 0) + 1 } }
          : vote
      ))
      toast.success('Vote recorded!')
    } catch (err) {
      toast.error('Failed to record vote')
    }
  }

  const handleInviteMember = async (e) => {
    e.preventDefault()
    if (!selectedTrip) return

    try {
      await collaborationService.inviteMember(selectedTrip.id, inviteEmail)
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      setShowInviteModal(false)
    } catch (err) {
      toast.error('Failed to send invitation')
    }
  }

  const handleCreateVote = async (title, options) => {
    if (!selectedTrip) return

    try {
      const newVote = await collaborationService.createVote({
        tripId: selectedTrip.id,
        title,
        options,
        createdBy: 'current-user'
      })
      setVotes(prev => [newVote, ...prev])
      toast.success('Vote created!')
    } catch (err) {
      toast.error('Failed to create vote')
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 rounded w-full"></div>
                  <div className="h-3 bg-surface-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load collaboration</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <ApperIcon name="Users" className="w-16 h-16 text-surface-300 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-surface-900 mb-2">No collaborative trips</h3>
          <p className="text-surface-600 mb-6">
            Create a trip and invite others to start planning together
          </p>
          <button
            onClick={() => navigate('/plan-trip')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Plan a Group Trip
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Trip Collaboration</h1>
          <p className="text-surface-600">Plan together, vote on activities, and share expenses</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTrip?.id || ''}
            onChange={(e) => handleTripChange(e.target.value)}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>{trip.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
          >
            <ApperIcon name="UserPlus" size={16} />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {selectedTrip && (
        <>
          {/* Trip Members */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Trip Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedTrip.members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-surface-900">{member.name}</div>
                    <div className="text-sm text-surface-600">{member.email}</div>
                  </div>
                  {member.role === 'organizer' && (
                    <div className="px-2 py-1 bg-accent text-white text-xs rounded-full">
                      Organizer
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Votes */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Group Decisions</h3>
              <button
                onClick={() => handleCreateVote(
                  'Where should we have dinner on Day 2?',
                  ['Italian Restaurant', 'Sushi Place', 'Local Street Food', 'Hotel Restaurant']
                )}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create Vote
              </button>
            </div>
            
            {votes.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Vote" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h4 className="font-medium text-surface-900 mb-2">No active votes</h4>
                <p className="text-surface-600 mb-4">Start making group decisions by creating a vote</p>
              </div>
            ) : (
              <div className="space-y-4">
                {votes.map((vote, index) => (
                  <motion.div
                    key={vote.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-surface-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-surface-900 break-words">{vote.title}</h4>
                      <div className="text-sm text-surface-600">
                        {Object.values(vote.votes).reduce((a, b) => a + b, 0)} votes
                      </div>
                    </div>
                    <div className="space-y-2">
                      {vote.options.map(option => {
                        const voteCount = vote.votes[option] || 0
                        const totalVotes = Object.values(vote.votes).reduce((a, b) => a + b, 0)
                        const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
                        const isUserVote = vote.userVote === option
                        
                        return (
                          <div key={option} className="relative">
                            <button
                              onClick={() => !vote.userVote && handleVote(vote.id, option)}
                              disabled={!!vote.userVote}
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
                                isUserVote 
                                  ? 'border-primary bg-primary/5 text-primary' 
                                  : vote.userVote 
                                    ? 'border-surface-200 bg-surface-50 text-surface-600 cursor-not-allowed'
                                    : 'border-surface-200 hover:border-primary hover:bg-surface-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium break-words">{option}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">{voteCount}</span>
                                  {isUserVote && <ApperIcon name="CheckCircle" size={16} />}
                                </div>
                              </div>
                              <div className="mt-2 bg-surface-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 text-xs text-surface-500">
                      Created by {vote.createdBy} • {vote.createdAt}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Shared Expenses */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Shared Expenses</h3>
            <div className="text-center py-8">
              <ApperIcon name="Receipt" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <h4 className="font-medium text-surface-900 mb-2">Expense splitting coming soon</h4>
              <p className="text-surface-600">
                Track and split shared expenses with your travel companions
              </p>
            </div>
          </div>
        </>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Invite Travel Companion</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="friend@example.com"
                  required
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  They'll receive an email invitation to join your trip and can vote on activities, 
                  view the itinerary, and share expenses.
                </p>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Collaborate