import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './components/ApperIcon'
import { routes } from './config/routes'

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigationItems = Object.values(routes).filter(route => route.showInNav)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Desktop Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40 hidden md:block">
        <div className="max-w-full px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Compass" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900">WanderWise</span>
            </div>
            <nav className="flex space-x-6">
              {navigationItems.map(item => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-surface-700 hover:text-primary hover:bg-surface-50'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors">
              <ApperIcon name="Bell" size={20} />
            </button>
            <button className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors">
              <ApperIcon name="Settings" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40 md:hidden">
        <div className="max-w-full px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Compass" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">WanderWise</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Compass" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-surface-900">WanderWise</span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navigationItems.map(item => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-surface-700 hover:text-primary hover:bg-surface-50'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex-shrink-0 bg-white border-t border-surface-200 z-40">
        <nav className="flex">
          {navigationItems.slice(0, 5).map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-600 hover:text-primary'
                }`
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Layout