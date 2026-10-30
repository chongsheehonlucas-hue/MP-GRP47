
import { useState } from 'react'

function Signup({ onGoLogin }) {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    function handleSignup(event) {
        event.preventDefault()

        
        if (password.length < 12) {
            setMessage('Password must be at least 12 characters.')
            return
        }

        
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.')
            return
        }

      
        setMessage(
            'Form validated. Account creation is not connected yet.'
        )
    }

    return (
        <div>
            <h1>Create an Account</h1>
            <h2>Digital Forensics Learning Tool</h2>

            <form onSubmit={handleSignup}>

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
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
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
                        autoComplete="new-password"
                        required
                    />
                </div>

                <button type="submit">Create Account</button>
            </form>

            <p role="status">{message}</p>

            <p>Already have an account?</p>
            <button type="button" onClick={onGoLogin}>
                Back to Login
            </button>
        </div>
    )
}

export default Signup
