// instructorSample.js
// SAMPLE DATA ONLY, matching the approved instructor design.
// In the real site these numbers will come from the database (through FastAPI).

export const INSTRUCTOR_SAMPLE = {
  name: '[Name]',
  totalStudents: 24,
  studentsFinishedAll: 9,
  avgCheckPercent: 77,
  avgCasePercent: 67,
  reportCount: 22,

  // Class results for each module (the number before the colon is the module id)
  moduleStats: {
    1: { studentsFinished: 22, avgScore: 84 },
    2: { studentsFinished: 19, avgScore: 78 },
    3: { studentsFinished: 15, avgScore: 71 },
    4: { studentsFinished: 9, avgScore: 66 },
  },

  // Class results for each case (the number before the colon is the case id)
  caseStats: {
    1: { attempts: 11, avgScore: 68, mostMissedTrap: 'the warrant covers the laptop but not the phone found at the scene.' },
    2: { attempts: 7, avgScore: 61, mostMissedTrap: 'no Faraday bag packed for a phone that is switched on.' },
    3: { attempts: 4, avgScore: 74, mostMissedTrap: 'the destination drive is smaller than the source drive.' },
  },

  // Students checked by the "Needs attention" card.
  // daysSinceActive: 0 = today, 1 = yesterday, and so on.
  students: [
    { id: 1, name: 'Student 01', avgCheckPercent: 88, daysSinceActive: 0 },
    { id: 2, name: 'Student 02', avgCheckPercent: 81, daysSinceActive: 1 },
    { id: 3, name: 'Student 03', avgCheckPercent: 74, daysSinceActive: 2 },
    { id: 4, name: 'Student 04', avgCheckPercent: 69, daysSinceActive: 4 },
    { id: 5, name: 'Student 05', avgCheckPercent: 52, daysSinceActive: 6 },
    { id: 6, name: 'Student 06', avgCheckPercent: 64, daysSinceActive: 16 },
  ],
}
