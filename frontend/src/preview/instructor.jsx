// Shows the instructor dashboard on its own preview page.
// Open it at http://localhost:5173/preview/instructor.html
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import '../styles/dashboard.css'
import InstructorDashboard from '../pages/InstructorDashboard.jsx'

createRoot(document.getElementById('root')).render(<InstructorDashboard />)
