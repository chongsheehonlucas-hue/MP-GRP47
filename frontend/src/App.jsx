
import { useState } from 'react'
import Login from './pages/login'
import Signup from './pages/signup'
import InstructorAnalysis from './pages/instructors_analysis'
import StudentDashboard from './pages/StudentDashboard.jsx'
import InstructorDashboard from './pages/InstructorDashboard.jsx'

function App() {

  // Determine which page is currently displayed
  const [page, setPage] = useState('login')

  // The logged-in user (username and role), sent back by the backend after login
  const [user, setUser] = useState(null)

  function handleLoginSuccess(user) {
    setUser(user)
    if (user.role === 'instructor') {
      setPage('instructor')
    } else {
      setPage('learner')
    }
  }

  // Log out on the server, then go back to the login page
  async function handleLogout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch {
      // Even if the server can't be reached, still return to the login page
    }
    setUser(null)
    setPage('login')
  }

  if (page === 'instructor') {
    return (
      <InstructorDashboard
        userName={user.username}
        onLogout={handleLogout}
        onOpenStudentAnalysis={() => setPage('analysis')}
      />
    )
  }

  // Student analysis page, opened from the instructor dashboard
  if (page === 'analysis') {
    return <InstructorAnalysis
    onBackToDashboard={() => setPage('instructor')} />
  }

  if (page === 'learner') {
    return <StudentDashboard userName={user.username} onLogout={handleLogout} />
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
