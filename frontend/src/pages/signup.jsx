
import { useState } from 'react'

function Signup({ onGoLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(event) {
    event.preventDefault()

    // Frontend validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('Creating account...')

    try {
      // Send registration information to FastAPI
      const response = await fetch(
        '/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        }
      )

      // Read the backend response
      const data = await response.json()

    //   Error detail set in auth.py 
      if (!response.ok) {
        if (typeof data.detail === 'string') {
          setMessage(data.detail)
        } else {
          setMessage('Please check your registration details.')
        }
        return
      }

      // Registration successful
      setMessage(data.message)
      setPassword('')
      setConfirmPassword('')

    } catch {
      setMessage('Cannot connect to the server.')

    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Create an Account</h1>
      <h2>Digital Forensics Learning Tool</h2>
{/* Function call */}
      <form onSubmit={handleSignup}>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={50}
            pattern="[A-Za-z0-9_]+"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p role="status">{message}</p>

      <button type="button" onClick={onGoLogin}>
        Back to Login
      </button>
    </div>
  )
}

export default Signup
