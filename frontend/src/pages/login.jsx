
import { useState } from 'react'

function Login() {

   
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    function handleLogin(event) {
        event.preventDefault()

        setMessage('Login submitted. Authentication havent code yet.')
    }

    return (
        <div>
            <h1>Digital Forensics Case Preparation Tool</h1>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>
                    <label htmlFor="username">Username: </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
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
