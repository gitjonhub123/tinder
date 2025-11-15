'use client'

import { useState } from 'react'
import { currentUser } from '@/lib/demoData'
import './profile.css'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(currentUser)

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, this would save to a backend
  }

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header-section">
          <div className="profile-photos-section">
            <img 
              src={profile.photos[0]} 
              alt={profile.name}
              className="profile-main-photo"
            />
            <div className="profile-photo-grid">
              {profile.photos.slice(1).map((photo, index) => (
                <img key={index} src={photo} alt={`Photo ${index + 2}`} className="profile-thumbnail" />
              ))}
              <div className="add-photo-placeholder">
                <span>+</span>
              </div>
            </div>
          </div>

          <div className="profile-header-info">
            <div className="profile-actions-header">
              <h1 className="profile-title">
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  profile.name
                )}
              </h1>
              <button
                className="edit-button"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
            </div>

            <div className="profile-basic-info">
              <div className="info-item">
                <span className="info-label">Age:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="edit-input small"
                  />
                ) : (
                  <span>{profile.age}</span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{profile.location}</span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Occupation:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{profile.occupation}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2 className="section-title">About Me</h2>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="edit-textarea"
                rows={5}
                placeholder="Tell others about yourself..."
              />
            ) : (
              <p className="profile-bio-text">{profile.bio}</p>
            )}
          </div>

          <div className="profile-section">
            <h2 className="section-title">Interests</h2>
            <div className="interests-container">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.interests.join(', ')}
                  onChange={(e) => handleChange('interests', e.target.value.split(', '))}
                  className="edit-input"
                  placeholder="Enter interests separated by commas"
                />
              ) : (
                <div className="interests-list">
                  {profile.interests.map((interest, index) => (
                    <span key={index} className="interest-badge">{interest}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
