// courseContent.js
// The 4 learning modules and 3 case scenarios. Both dashboards use this list.
// Later this can come from the database instead.

export const MODULES = [
  {
    id: 1,
    code: 'Module 1',
    title: 'Legal Authorization',
    // Placeholder text from the design. The Module 1 owner should confirm it.
    description: "Check you have the right legal authority before you touch a device, and spot when it doesn't cover everything at the scene.",
    icon: 'scales',
    // SAMPLE number. The Module 1 owner will confirm how many sub-modules there are.
    subModuleCount: 4,
  },
  {
    id: 2,
    code: 'Module 2',
    title: 'Case Scoping',
    description: 'Pin down what the investigation is looking for, which devices and data are in scope, and what is not.',
    icon: 'target',
    subModuleCount: 4, // SAMPLE number, to be confirmed by the Module 2 owner
  },
  {
    id: 3,
    code: 'Module 3',
    title: 'Risk & Volatility Assessment',
    description: 'Work out which evidence could change or disappear first, and how that shapes what you do at the scene.',
    icon: 'timer',
    subModuleCount: 4, // SAMPLE number, to be confirmed by the Module 3 owner
  },
  {
    id: 4,
    code: 'Module 4',
    title: 'Equipment Readiness',
    description: 'Prepare and test the right kit, from write-blockers and hashing to Faraday bags and packaging, before you deploy.',
    icon: 'briefcase',
    subModuleCount: 6, // 4.1 to 4.6
  },
]

export const CASES = [
  {
    id: 1,
    code: 'Case 01',
    title: 'Laptop seizure',
    description: "A suspect's laptop needs to be seized from a home. Is your paperwork right? Is your kit?",
    icon: 'laptop',
  },
  {
    id: 2,
    code: 'Case 02',
    title: 'Mobile device case',
    description: 'A phone is at the centre of this case. Plan how to stop it being wiped or locking before it reaches the lab.',
    icon: 'phone',
  },
  {
    id: 3,
    code: 'Case 03',
    title: 'Corporate insider threat',
    description: 'An employee may have taken company data. Work out what you can take from the office and what you need to bring.',
    icon: 'building',
  },
]
