// instructorApi.js
// Gets the class results for the instructor dashboard from the backend.
// It uses the same backend route as the Student analysis page (/api/instructor/analytics),
// which reads backend/student_analysis.db. Only a logged-in instructor can use it.

// Turns a number like 76.7 into 77. Leaves "no score yet" (null) as null.
function roundOrNull(value) {
  if (value === null) {
    return null
  }
  return Math.round(value)
}

// The backend sends a lot of detail. This picks out what the dashboard shows,
// using the same names as the sample data, so the page code stays simple.
function summariseClassResults(data) {
  const moduleCount = data.modules.length

  // Results for each module. The number before the colon is the module id (1 to 4).
  // "studentsFinished" counts students who have a knowledge check score for that module,
  // the same way the Student analysis page counts them.
  const moduleStats = {}
  for (const module of data.modules) {
    moduleStats[module.module_id] = {
      studentsFinished: module.assessed,
      avgScore: roundOrNull(module.average),
    }
  }

  // Students with a score in every module count as having finished all 4
  let studentsFinishedAll = 0
  for (const student of data.students) {
    if (moduleCount > 0 && student.assessed === moduleCount) {
      studentsFinishedAll = studentsFinishedAll + 1
    }
  }

  // Each student's name and average score (null if they have no scores yet)
  const students = []
  for (const student of data.students) {
    students.push({
      id: student.learner_id,
      name: student.display_name,
      avgCheckPercent: student.average,
    })
  }

  return {
    totalStudents: data.total_students,
    studentsFinishedAll: studentsFinishedAll,
    avgCheckPercent: roundOrNull(data.average_score),
    moduleStats: moduleStats,
    students: students,
  }
}

// Asks the backend for the class results.
// "async" means it waits for the server's answer before carrying on.
export async function loadClassResults() {
  const response = await fetch('/api/instructor/analytics', {
    credentials: 'include', // send the login cookie, so the server knows who is asking
  })

  if (!response.ok) {
    // For example 401 (not logged in) or 403 (not an instructor)
    throw new Error('the server answered with error ' + response.status)
  }

  const data = await response.json()
  return summariseClassResults(data)
}
