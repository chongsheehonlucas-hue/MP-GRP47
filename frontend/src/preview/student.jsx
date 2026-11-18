// Shows the student dashboard on its own preview page.
// Open it at http://localhost:5173/preview/student.html
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import '../styles/dashboard.css'
import StudentDashboard from '../pages/StudentDashboard.jsx'

createRoot(document.getElementById('root')).render(<StudentDashboard />)
