import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

function AuthModal({ onClose, onSuccess }) {
  const { signIn, signUp, isConfigured } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isConfigured) {
    return (
      <div className="auth-overlay" onClick={onClose}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Backend not configured yet</h2>
          <p>
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>
            in Vercel (for the live site) or in a local <code>.env</code> file, then
            redeploy / restart. See <code>BACKEND_SETUP.md</code>.
          </p>
          <button type="button" className="auth-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await signIn(email.trim(), password)
        onSuccess?.('Signed in successfully')
        onClose()
      } else {
        const data = await signUp(email.trim(), password)
        if (data?.user && !data.session) {
          setMessage(
            'Account created. Check your email to confirm, then log in.'
          )
          setMode('login')
          setPassword('')
        } else {
          onSuccess?.('Account created and signed in')
          onClose()
        }
      }
    } catch (err) {
      const raw = err?.message || 'Authentication failed'
      if (raw.toLowerCase().includes('invalid login')) {
        setError('Incorrect email or password.')
      } else if (raw.toLowerCase().includes('already registered')) {
        setError('This email is already registered. Try logging in.')
        setMode('login')
      } else {
        setError(raw)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Log in to sync your assessment and learning progress across devices.'
            : 'Create a free account so your progress is saved in the cloud.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="At least 6 characters"
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" className="auth-primary" disabled={submitting}>
            {submitting
              ? mode === 'login'
                ? 'Signing in...'
                : 'Creating account...'
              : mode === 'login'
                ? 'Log in'
                : 'Sign up'}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setError('')
            setMessage('')
          }}
        >
          {mode === 'login'
            ? 'Need an account? Sign up'
            : 'Already have an account? Log in'}
        </button>

        <button type="button" className="auth-close" onClick={onClose}>
          Continue as guest
        </button>
      </div>
    </div>
  )
}

export default AuthModal
