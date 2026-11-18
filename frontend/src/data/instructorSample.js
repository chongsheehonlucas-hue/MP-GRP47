// instructorSample.js
// SAMPLE DATA ONLY for the parts of the instructor dashboard that have no database tables yet:
// the case scenarios and the AI Result Reports.
// Module results, student numbers and the Needs attention list come from the database
// (see instructorApi.js).

export const INSTRUCTOR_SAMPLE = {
  avgCasePercent: 67,
  reportCount: 22,

  // Class results for each case (the number before the colon is the case id)
  caseStats: {
    1: { attempts: 11, avgScore: 68, mostMissedTrap: 'the warrant covers the laptop but not the phone found at the scene.' },
    2: { attempts: 7, avgScore: 61, mostMissedTrap: 'no Faraday bag packed for a phone that is switched on.' },
    3: { attempts: 4, avgScore: 74, mostMissedTrap: 'the destination drive is smaller than the source drive.' },
  },
}
