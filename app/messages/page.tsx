'use client'

import { useState } from 'react'
import { demoUsers, User } from '@/lib/demoData'
import './messages.css'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
}

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', senderId: '1', text: 'Hey! How are you?', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', senderId: 'current', text: 'I\'m doing great, thanks! How about you?', timestamp: new Date(Date.now() - 3300000) },
    { id: '3', senderId: '1', text: 'Pretty good! Would you like to grab coffee sometime?', timestamp: new Date(Date.now() - 3000000) },
  ],
  '2': [
    { id: '4', senderId: '2', text: 'Hi there! Nice to match with you.', timestamp: new Date(Date.now() - 7200000) },
    { id: '5', senderId: 'current', text: 'Likewise! I saw you like hiking - any favorite trails?', timestamp: new Date(Date.now() - 6900000) },
  ],
  '3': [
    { id: '6', senderId: '3', text: 'Hello! I love your profile!', timestamp: new Date(Date.now() - 1800000) },
  ]
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)

  // Get matched users (users we've liked)
  const matchedUsers = demoUsers.slice(0, 3) // Simulating matches

  const selectedUser = matchedUsers.find(u => u.id === selectedChat)
  const currentMessages = selectedChat ? (messages[selectedChat] || []) : []

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      text: messageText,
      timestamp: new Date()
    }

    setMessages({
      ...messages,
      [selectedChat]: [...currentMessages, newMessage]
    })

    setMessageText('')
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-sidebar">
          <h2 className="messages-title">Messages</h2>
          <div className="chat-list">
            {matchedUsers.map(user => (
              <div
                key={user.id}
                className={`chat-item ${selectedChat === user.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(user.id)}
              >
                <img 
                  src={user.photos[0]} 
                  alt={user.name}
                  className="chat-avatar"
                />
                <div className="chat-info">
                  <div className="chat-header">
                    <span className="chat-name">{user.name}</span>
                    {messages[user.id] && messages[user.id].length > 0 && (
                      <span className="chat-time">
                        {formatTime(messages[user.id][messages[user.id].length - 1].timestamp)}
                      </span>
                    )}
                  </div>
                  {messages[user.id] && messages[user.id].length > 0 && (
                    <p className="chat-preview">
                      {messages[user.id][messages[user.id].length - 1].text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="messages-main">
          {selectedUser ? (
            <>
              <div className="chat-header-bar">
                <div className="chat-header-info">
                  <img 
                    src={selectedUser.photos[0]} 
                    alt={selectedUser.name}
                    className="chat-header-avatar"
                  />
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <p className="chat-status">Online</p>
                  </div>
                </div>
              </div>

              <div className="messages-list">
                {currentMessages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === 'current' ? 'sent' : 'received'}`}
                  >
                    <p className="message-text">{message.text}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <input
                  type="text"
                  className="message-input"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="send-button" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
