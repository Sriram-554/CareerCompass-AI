import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

function AuthButton({ className = '', variant = 'nav' }) {
  const { user, loading, signOut, isConfigured } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!status) return undefined
    const timer = setTimeout(() => setStatus(''), 3200)
    return () => clearTimeout(timer)
  }, [status])

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      setMenuOpen(false)
      setStatus('Signed out successfully')
    } catch (error) {
      console.error(error)
      setStatus('Could not sign out. Try again.')
    } finally {
      setSigningOut(false)
    }
  }

  if (loading) {
    return (
      <button type="button" className={className} disabled>
        Checking...
      </button>
    )
  }

  if (user) {
    const label = user.email?.split('@')[0] || 'Account'

    return (
      <div className={`auth-menu-wrap ${variant}`} ref={menuRef}>
        <button
          type="button"
          className={`${className} auth-user-button`}
          onClick={() => setMenuOpen(open => !open)}
          aria-expanded={menuOpen}
          title={user.email}
        >
          <span className="auth-user-dot" aria-hidden="true" />
          <span className="auth-user-label">{label}</span>
        </button>

        {menuOpen && (
          <div className="auth-menu">
            <p className="auth-menu-email">{user.email}</p>
            <p className="auth-menu-note">Progress syncs while signed in</p>
            <button
              type="button"
              className="auth-menu-action"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? 'Signing out...' : 'Log out'}
            </button>
          </div>
        )}

        {status && <div className="auth-toast">{status}</div>}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setShowModal(true)}
      >
        {isConfigured ? 'Log in' : 'Account'}
      </button>
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onSuccess={(msg) => setStatus(msg)}
        />
      )}
      {status && <div className="auth-toast">{status}</div>}
    </>
  )
}

export default AuthButton
