import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import PlanTrip from '../pages/PlanTrip'
import TripDetails from '../pages/TripDetails'
import Budget from '../pages/Budget'
import Search from '../pages/Search'
import Collaborate from '../pages/Collaborate'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home,
    showInNav: false
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard,
    showInNav: true
  },
  planTrip: {
    id: 'planTrip',
    label: 'Plan Trip',
    path: '/plan-trip',
    icon: 'MapPin',
    component: PlanTrip,
    showInNav: true
  },
  tripDetails: {
    id: 'tripDetails',
    label: 'Trip Details',
    path: '/trip/:id',
    icon: 'Calendar',
    component: TripDetails,
    showInNav: false
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',
    icon: 'DollarSign',
    component: Budget,
    showInNav: true
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search,
    showInNav: false
  },
  collaborate: {
    id: 'collaborate',
    label: 'Collaborate',
    path: '/collaborate',
    icon: 'Users',
    component: Collaborate,
    showInNav: true
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile,
    showInNav: true
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/*',
    icon: 'AlertCircle',
    component: NotFound,
    showInNav: false
  }
}

export const routeArray = Object.values(routes)