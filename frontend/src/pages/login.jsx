
import { useState } from 'react'

function Login({ onGoSignup, onLoginSuccess }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()

    setLoading(true)
    setMessage('Checking credentials...')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          typeof data.detail === 'string'
            ? data.detail
            : 'Login failed.'
        )
        return
      }

      // Backend confirmed the login, fetched from fetch('/api/login'
      onLoginSuccess(data.user) 

    } catch {
      setMessage('Cannot connect to the server.')

    } finally {
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Digital Forensics Case Preparation Tool</h1>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
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
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p role="status">{message}</p>

      <button type="button" onClick={onGoSignup}>
        Sign Up
      </button>
    </div>
  )
}

export default Login
