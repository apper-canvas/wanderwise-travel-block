import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import AlertCard from '@/components/molecules/AlertCard';
import EmptyState from '@/components/molecules/EmptyState';
import CollaborateHeader from '@/components/organisms/CollaborateHeader';
import MemberGrid from '@/components/organisms/MemberGrid';
import VoteSection from '@/components/organisms/VoteSection';
import Card from '@/components/atoms/Card';
import { tripService, collaborationService } from '@/services';

const CollaboratePage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tripsData = await tripService.getAll();
        const collaborativeTrips = tripsData.filter(trip => trip.members.length > 1);
        setTrips(collaborativeTrips);
        if (collaborativeTrips.length > 0) {
          setSelectedTrip(collaborativeTrips[0]);
          const votesData = await collaborationService.getVotes(collaborativeTrips[0].id);
          setVotes(votesData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load collaboration data');
        toast.error('Failed to load collaboration data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTripChange = async (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    setSelectedTrip(trip);
    try {
      const votesData = await collaborationService.getVotes(tripId);
      setVotes(votesData);
    } catch (err) {
      toast.error('Failed to load votes');
    }
  };

  const handleVote = async (voteId, option) => {
    try {
      await collaborationService.vote(voteId, option);
      setVotes(prev => prev.map(vote =>
        vote.id === voteId
          ? { ...vote, userVote: option, votes: { ...vote.votes, [option]: (vote.votes[option] || 0) + 1 } }
          : vote
      ));
      toast.success('Vote recorded!');
    } catch (err) {
      toast.error('Failed to record vote');
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;

    try {
      await collaborationService.inviteMember(selectedTrip.id, inviteEmail);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (err) {
      toast.error('Failed to send invitation');
    }
  };

  const handleCreateVote = async (title, options) => {
    if (!selectedTrip) return;

    try {
      const newVote = await collaborationService.createVote({
        tripId: selectedTrip.id,
        title,
        options,
        createdBy: 'current-user'
      });
      setVotes(prev => [newVote, ...prev]);
      toast.success('Vote created!');
    } catch (err) {
      toast.error('Failed to create vote');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="collaborate" />
      </div>
    );
  }

  if (error) {
    return (
      <AlertCard
        icon="AlertCircle"
        iconColorClass="text-red-500"
        title="Failed to load collaboration"
        message={error}
        buttonText="Try Again"
        onButtonClick={() => window.location.reload()}
      />
    );
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        icon="Users"
        title="No collaborative trips"
        message="Create a trip and invite others to start planning together"
        buttonText="Plan a Group Trip"
        onButtonClick={() => navigate('/plan-trip')}
        animateIcon={true}
        className="max-w-md mx-auto"
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <CollaborateHeader
        trips={trips}
        selectedTripId={selectedTrip?.id}
        onTripChange={handleTripChange}
        onInviteClick={() => setShowInviteModal(true)}
      />

      {selectedTrip && (
        <>
          <MemberGrid members={selectedTrip.members} />

          <VoteSection votes={votes} onCreateVote={handleCreateVote} onVote={handleVote} />

          {/* Shared Expenses */}
          <Card className="p-6">
            <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Shared Expenses</Heading>
            <EmptyState
              icon="Receipt"
              title="Expense splitting coming soon"
              message="Track and split shared expenses with your travel companions"
              animateIcon={false}
              className="py-8"
            />
          </Card>
        </>
      )}

      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Travel Companion">
        <form onSubmit={handleInviteMember} className="space-y-4">
          <FormField
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="friend@example.com"
            required
          />
          <Card className="bg-blue-50 border border-blue-200 p-3">
            <Text className="!text-sm !text-blue-700">
              They'll receive an email invitation to join your trip and can vote on activities,
              view the itinerary, and share expenses.
            </Text>
          </Card>
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="flex-1 border border-surface-300 text-surface-700 hover:bg-surface-50 !px-4 !py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-white hover:bg-blue-600 !px-4 !py-2"
            >
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CollaboratePage;