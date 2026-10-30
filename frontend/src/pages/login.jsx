
import { useState } from 'react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    setMessage('Connecting to backend...')

    try {
      // Send login data to FastAPI
      const response = await fetch(
        'http://127.0.0.1:8000/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        }
      )

      // wait for response from backend
      const data = await response.json()

      if (!response.ok) {
        setMessage(data.detail || 'Login failed.')
        return
      }

      // Real authentication will be added later
      setMessage('Server responded, LOGIN NOT YET IMPLEMENTED.')

    } catch {
      setMessage('Cannot connect to FastAPI.')

    } finally {
      setPassword('')
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
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p role="status">{message}</p>
    </div>
  )
}

export default Login
