'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Navigation.css'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="logo-text">Match</span>
          <span className="logo-dot">.</span>
        </Link>
        <div className="nav-links">
          <Link 
            href="/" 
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Discover
          </Link>
          <Link 
            href="/messages" 
            className={pathname === '/messages' ? 'nav-link active' : 'nav-link'}
          >
            Messages
          </Link>
          <Link 
            href="/profile" 
            className={pathname === '/profile' ? 'nav-link active' : 'nav-link'}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}
