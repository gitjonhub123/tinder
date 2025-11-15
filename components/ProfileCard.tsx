'use client'

import { User } from '@/lib/demoData'
import './ProfileCard.css'
import { useState } from 'react'

interface ProfileCardProps {
  user: User
  onLike: (userId: string) => void
  onDislike: (userId: string) => void
}

export default function ProfileCard({ user, onLike, onDislike }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const handleLike = () => {
    setIsLiked(true)
    setTimeout(() => {
      onLike(user.id)
      setIsLiked(false)
    }, 300)
  }

  const handleDislike = () => {
    setIsDisliked(true)
    setTimeout(() => {
      onDislike(user.id)
      setIsDisliked(false)
    }, 300)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % user.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length)
  }

  return (
    <div className={`profile-card ${isLiked ? 'liked' : ''} ${isDisliked ? 'disliked' : ''}`}>
      <div className="profile-photo-container">
        <img 
          src={user.photos[currentPhotoIndex]} 
          alt={user.name}
          className="profile-photo"
        />
        {user.photos.length > 1 && (
          <>
            <button className="photo-nav prev" onClick={prevPhoto}>‹</button>
            <button className="photo-nav next" onClick={nextPhoto}>›</button>
            <div className="photo-indicator">
              {currentPhotoIndex + 1} / {user.photos.length}
            </div>
          </>
        )}
      </div>
      <div className="profile-info">
        <div className="profile-header">
          <h2 className="profile-name">{user.name}, {user.age}</h2>
          <p className="profile-location">📍 {user.location}</p>
        </div>
        <p className="profile-occupation">{user.occupation}</p>
        <p className="profile-bio">{user.bio}</p>
        <div className="profile-interests">
          {user.interests.map((interest, index) => (
            <span key={index} className="interest-tag">{interest}</span>
          ))}
        </div>
        <div className="profile-actions">
          <button className="action-btn dislike-btn" onClick={handleDislike}>
            ✕
          </button>
          <button className="action-btn like-btn" onClick={handleLike}>
            ♥
          </button>
        </div>
      </div>
    </div>
  )
}
