
import { useState } from 'react'
import Login from './pages/login'
import Signup from './pages/signup'

function App() {

  // Determine which page is currently displayed
  const [page, setPage] = useState('login')

  return (
    <div>
      {page === 'login' ? (
        <Login onGoSignup={() => setPage('signup')} />
      ) : (
        <Signup onGoLogin={() => setPage('login')} />
      )}
    </div>
  )       
}

export default App
