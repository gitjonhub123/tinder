'use client'

import { useState } from 'react'
import ProfileCard from '@/components/ProfileCard'
import { demoUsers, User } from '@/lib/demoData'
import './page.css'

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>(demoUsers)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedUsers, setLikedUsers] = useState<string[]>([])
  const [matches, setMatches] = useState<string[]>([])

  const handleLike = (userId: string) => {
    setLikedUsers([...likedUsers, userId])
    // Simulate match (50% chance)
    if (Math.random() > 0.5) {
      setMatches([...matches, userId])
      setTimeout(() => {
        alert(`It's a match! You and ${users.find(u => u.id === userId)?.name} liked each other!`)
      }, 500)
    }
    moveToNext()
  }

  const handleDislike = (userId: string) => {
    moveToNext()
  }

  const moveToNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Reset or show end message
      setCurrentIndex(0)
      setUsers([...demoUsers]) // Reset users
    }
  }

  const currentUser = users[currentIndex]

  return (
    <div className="discover-page">
      <div className="discover-container">
        <div className="discover-header">
          <h1>Discover People</h1>
          <p>Find your perfect match</p>
        </div>
        
        {currentUser ? (
          <ProfileCard
            user={currentUser}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ) : (
          <div className="no-more-profiles">
            <h2>No more profiles to show</h2>
            <p>Check back later for new matches!</p>
          </div>
        )}

        <div className="matches-preview">
          {matches.length > 0 && (
            <div className="matches-badge">
              {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
