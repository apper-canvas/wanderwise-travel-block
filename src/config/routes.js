import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import PlanTripPage from '@/components/pages/PlanTripPage';
import TripDetailsPage from '@/components/pages/TripDetailsPage';
import BudgetPage from '@/components/pages/BudgetPage';
import SearchPage from '@/components/pages/SearchPage';
import CollaboratePage from '@/components/pages/CollaboratePage';
import ProfilePage from '@/components/pages/ProfilePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage,
    showInNav: false
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage,
    showInNav: true
  },
  planTrip: {
    id: 'planTrip',
    label: 'Plan Trip',
    path: '/plan-trip',
    icon: 'MapPin',
component: PlanTripPage,
    showInNav: true
  },
  tripDetails: {
    id: 'tripDetails',
    label: 'Trip Details',
    path: '/trip/:id',
    icon: 'Calendar',
component: TripDetailsPage,
    showInNav: false
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',
    icon: 'DollarSign',
component: BudgetPage,
    showInNav: true
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
component: SearchPage,
    showInNav: false
  },
  collaborate: {
    id: 'collaborate',
    label: 'Collaborate',
    path: '/collaborate',
    icon: 'Users',
component: CollaboratePage,
    showInNav: true
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
component: ProfilePage,
    showInNav: true
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/*',
    icon: 'AlertCircle',
component: NotFoundPage,
    showInNav: false
  }
}

export const routeArray = Object.values(routes)