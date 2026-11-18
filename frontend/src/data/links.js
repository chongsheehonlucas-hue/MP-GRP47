// links.js
// Where the dashboard links go.
// Pages that are not built yet go to a "coming soon" placeholder page.
// When a real page is ready, change its link here.

// The two dashboard pages (temporary preview addresses for now)
export const STUDENT_HOME = '/preview/student.html'
export const INSTRUCTOR_HOME = '/preview/instructor.html'

// Makes a link to the placeholder page, with the page name in the address.
// Example: comingSoon('Quiz history') gives '/preview/placeholder.html?page=Quiz%20history'
export function comingSoon(pageName) {
  return '/preview/placeholder.html?page=' + encodeURIComponent(pageName)
}

// Student analysis page: built by a groupmate.
// When their page is ready, replace comingSoon('Student analysis') with its address.
export const STUDENT_ANALYSIS = comingSoon('Student analysis')
