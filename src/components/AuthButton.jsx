import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

function AuthButton({ className = '' }) {
  const { user, loading, signOut, isConfigured } = useAuth()
  const [showModal, setShowModal] = useState(false)

  if (loading) {
    return (
      <button type="button" className={className} disabled>
        ...
      </button>
    )
  }

  if (user) {
    return (
      <button
        type="button"
        className={className}
        onClick={async () => {
          try {
            await signOut()
          } catch (error) {
            console.error(error)
          }
        }}
        title={user.email}
      >
        Log out
      </button>
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
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default AuthButton
