// studentSample.js
// SAMPLE DATA ONLY, matching the approved student design.
// In the real site these numbers will come from the database (through FastAPI).

export const STUDENT_SAMPLE = {
  name: '[Name]',

  // true shows the "Welcome, [Name]." version for someone logging in for the first time
  isFirstLogin: false,

  // How many sub-modules the student has finished in each module.
  // The number before the colon is the module id.
  subModulesDone: {
    1: 4,
    2: 4,
    3: 4,
    4: 2,
  },

  casesAttempted: 0,
  reportCount: 0,

  // Latest knowledge check attempts, newest first.
  // Titles must be the exact fixed sub-module titles.
  recentChecks: [
    { code: '4.2', title: 'Learning to Identify Target Devices and Storage Types', score: 3, maxScore: 5 },
    { code: '4.1', title: 'Explaining Why Equipment Readiness Matters', score: 5, maxScore: 5 },
  ],
}
