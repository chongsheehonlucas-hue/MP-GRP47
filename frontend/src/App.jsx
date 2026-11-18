
import { useState } from 'react'
import Login from './pages/login'
import Signup from './pages/signup'
import InstructorAnalysis from './pages/instructors_analysis'

function App() {

  // Determine which page is currently displayed
  const [page, setPage] = useState('login')

  function handleLoginSuccess(user) {
    if (user.role === 'instructor') {
      setPage('instructor')
    } else {
      setPage('learner')
    }
  }
  
  if (page === 'instructor') {
    return <InstructorAnalysis />
  }

  if (page === 'learner') {
    return <p>Login successful. Learner page coming soon.</p>
  }

  return (
    <div>
      {page === 'login' ? (
        <Login onGoSignup={() => setPage('signup')}
        onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Signup onGoLogin={() => setPage('login')} />
      )}
    </div>
  )       
}

export default App
