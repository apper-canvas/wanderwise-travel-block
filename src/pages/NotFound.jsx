import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-full flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="MapPin" className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold text-surface-900 mb-4">
          Looks like you're off the map!
        </h1>
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ApperIcon name="Home" size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound