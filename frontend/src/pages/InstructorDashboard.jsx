// InstructorDashboard.jsx
// The instructor's home page after login. Built to match the approved instructor design.
// All numbers come from INSTRUCTOR_SAMPLE for now. Later they will come from the database.

import '../styles/tokens.css'
import '../styles/dashboard.css'
import Header from '../components/Header.jsx'
import StepStrip from '../components/StepStrip.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Icon from '../components/Icon.jsx'
import { MODULES, CASES } from '../data/courseContent.js'
import { INSTRUCTOR_SAMPLE } from '../data/instructorSample.js'
import { NOT_BUILT_YET } from '../data/links.js'

/* ---------- Calculations (design spec, section 5.9) ---------- */

// e.g. 9 out of 24 = 38
function toPercent(part, whole) {
  return Math.round((part / whole) * 100)
}

// "Needs attention" rule: average below 60%, or no activity for 14 days or more.
// Open item: the team still needs to confirm these two numbers.
function needsAttention(student) {
  return student.avgCheckPercent < 60 || student.daysSinceActive >= 14
}

// The reason shown in the "Needs attention" card
function attentionReason(student) {
  if (student.avgCheckPercent < 60) {
    return 'Average score ' + student.avgCheckPercent + '%'
  }
  return 'No activity for ' + student.daysSinceActive + ' days'
}

/* ---------- One module card (class results) ---------- */

function ModuleCard({ module, stats, totalStudents }) {
  const percent = toPercent(stats.studentsFinished, totalStudents)

  return (
    <article className="card module-card">
      <div className="card__top">
        <span className="icon-tile">
          <Icon name={module.icon} size={22} strokeWidth={1.8} />
        </span>
        <span className="chip">Avg score {stats.avgScore}%</span>
      </div>

      <div className="card__text">
        <span className="label">{module.code}</span>
        <h3 className="module-card__title">{module.title}</h3>
        <p className="module-card__desc">{module.description}</p>
      </div>

      <div className="card__bottom">
        <div className="progress-row">
          <span>
            {stats.studentsFinished} of {totalStudents} students finished
          </span>
          <span>{percent}%</span>
        </div>
        <ProgressBar percent={percent} label={module.title + ': students finished'} />

        <div className="card__actions">
          {/* Review = see the module as a student sees it. Edit = change its content. */}
          <a className="btn btn--secondary" href={NOT_BUILT_YET} aria-label={'Review ' + module.title}>
            <Icon name="eye" size={18} />
            Review
          </a>
          {/* Open item: the content editor is an optional add-on, so Edit is a placeholder for now */}
          <a className="btn btn--primary" href={NOT_BUILT_YET} aria-label={'Edit ' + module.title + ' content'}>
            <Icon name="pencil" size={18} />
            Edit
          </a>
        </div>
      </div>
    </article>
  )
}

/* ---------- One case card (class results) ---------- */

function CaseCard({ caseItem, stats }) {
  return (
    <article className="card case-card">
      <div className="card__top">
        <span className="icon-tile">
          <Icon name={caseItem.icon} size={22} strokeWidth={1.8} />
        </span>
        <span className="label">{caseItem.code}</span>
      </div>

      <h3 className="case-card__title">{caseItem.title}</h3>
      <p className="case-card__desc">{caseItem.description}</p>

      <dl className="stat-grid">
        <div className="stat-tile">
          <dt>Attempts</dt>
          <dd>{stats.attempts}</dd>
        </div>
        <div className="stat-tile">
          <dt>Avg score</dt>
          <dd>{stats.avgScore}%</dd>
        </div>
      </dl>

      <p className="missed-trap">
        <strong>Most missed trap:</strong> {stats.mostMissedTrap}
      </p>

      <div className="card__bottom">
        <div className="card__actions card__actions--split">
          <a className="btn btn--secondary" href={NOT_BUILT_YET} aria-label={'Review ' + caseItem.title}>
            <Icon name="eye" size={18} />
            Review
          </a>
          <a className="btn btn--primary" href={NOT_BUILT_YET} aria-label={'Edit ' + caseItem.title + ' content'}>
            <Icon name="pencil" size={18} />
            Edit
          </a>
        </div>
      </div>
    </article>
  )
}

/* ---------- The whole page ---------- */

// userName: the logged-in instructor's name (App.jsx sends it in).
// onLogout: what Log out does. onOpenStudentAnalysis: opens the Student analysis page.
// App.jsx sends both in.
function InstructorDashboard({ userName, onLogout, onOpenStudentAnalysis }) {
  const data = INSTRUCTOR_SAMPLE
  const displayName = userName || data.name // use the real name if we have one

  // Add up the attempts for all 3 cases
  let caseAttempts = 0
  for (const caseItem of CASES) {
    caseAttempts = caseAttempts + data.caseStats[caseItem.id].attempts
  }

  const finishedAllPercent = toPercent(data.studentsFinishedAll, data.totalStudents)

  // Students who match the "Needs attention" rule
  const flaggedStudents = data.students.filter((student) => needsAttention(student))

  const steps = [
    {
      label: 'Part 1 · Learn',
      title: '4 learning modules',
      status: data.studentsFinishedAll + ' of ' + data.totalStudents + ' students finished all 4',
    },
    { label: 'Part 2 · Apply', title: '3 case scenarios', status: caseAttempts + ' attempts so far' },
    { label: 'Review', title: 'AI Result Reports', status: data.reportCount + ' reports generated' },
  ]

  const menuLinks = [
    { label: 'Home', href: '#', isCurrent: true }, // you are already on Home
    // The Student analysis page is built by a groupmate. Clicking asks App.jsx to show it.
    { label: 'Student analysis', href: '#', isCurrent: false, onClick: onOpenStudentAnalysis },
  ]

  return (
    <div className="app">
      <Header
        searchPlaceholder="Search students, modules or cases"
        menuLinks={menuLinks}
        userName={displayName}
        roleLabel="Instructor"
        onLogout={onLogout}
      />

      <main className="page">
        {/* Greeting */}
        <div className="greeting">
          <span className="label">Instructor dashboard</span>
          <h1 className="h1">Welcome back, {displayName}.</h1>
        </div>

        <StepStrip steps={steps} currentStep={1} />

        <div className="layout">
          {/* ===== Main column ===== */}
          <div className="layout__main">
            {/* Learning modules */}
            <section className="section" aria-labelledby="modules-heading">
              <div className="section-head">
                <div className="section-head__text">
                  <span className="label">Part 1 · Learn</span>
                  <h2 className="h2" id="modules-heading">Learning modules</h2>
                  <p className="lead">
                    See how the class is doing in each module. Use Review to go through a module the way students see
                    it, and Edit to change its content, activities and knowledge check.
                  </p>
                </div>
              </div>

              <div className="card-grid">
                {MODULES.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    stats={data.moduleStats[module.id]}
                    totalStudents={data.totalStudents}
                  />
                ))}
              </div>
            </section>

            {/* Case scenarios */}
            <section className="section" aria-labelledby="cases-heading">
              <div className="section-head">
                <div className="section-head__text">
                  <span className="label">Part 2 · Apply</span>
                  <h2 className="h2" id="cases-heading">Case scenarios</h2>
                  <p className="lead">
                    Each case runs through all four stages in order: legal, scoping, risk, then equipment. Use Review to
                    play through a case as a student, and Edit to change its brief, decisions and traps.
                  </p>
                </div>
                <span className="chip">Beginner level · 4 stages each</span>
              </div>

              <div className="card-grid">
                {CASES.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} stats={data.caseStats[caseItem.id]} />
                ))}
              </div>
            </section>
          </div>

          {/* ===== Side column ===== */}
          <aside className="layout__aside">
            {/* a) Class progress */}
            <section className="card side-card">
              <h2 className="h2 h2--small">Class progress</h2>
              <div>
                <span className="big-stat">{finishedAllPercent}%</span>
                <p className="caption">of students finished all 4 modules</p>
              </div>
              <ProgressBar percent={finishedAllPercent} label="Students who finished all 4 modules" isYellow={true} />
              <dl className="stat-grid">
                <div className="stat-tile">
                  <dt>Students</dt>
                  <dd>{data.totalStudents}</dd>
                </div>
                <div className="stat-tile">
                  <dt>Avg check score</dt>
                  <dd>{data.avgCheckPercent}%</dd>
                </div>
                <div className="stat-tile">
                  <dt>Avg case score</dt>
                  <dd>{data.avgCasePercent}%</dd>
                </div>
                <div className="stat-tile">
                  <dt>Case attempts</dt>
                  <dd>{caseAttempts}</dd>
                </div>
              </dl>
            </section>

            {/* b) Needs attention */}
            <section className="card side-card">
              <h2 className="h2 h2--small side-card__heading">
                <Icon name="warning" size={20} />
                Needs attention
              </h2>
              <p className="caption">Average below 60%, or no activity for 14 days or more.</p>
              {flaggedStudents.length === 0 ? (
                <p className="empty">No one to flag yet.</p>
              ) : (
                <ul className="attention-list">
                  {flaggedStudents.map((student) => (
                    <li key={student.id}>
                      {/* Opens the Student analysis page, where the instructor can pick this student */}
                      <a className="attention-link" href="#" onClick={onOpenStudentAnalysis}>
                        <span className="attention-link__text">
                          <span className="attention-link__name">{student.name}</span>
                          <span className="attention-link__reason">{attentionReason(student)}</span>
                        </span>
                        <Icon name="arrowRight" size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* c) AI Result Reports */}
            <section className="card side-card">
              <h2 className="h2 h2--small side-card__heading">
                <Icon name="document" size={20} />
                AI Result Reports
              </h2>
              <p className="side-card__text">
                {data.reportCount} reports generated so far. Open a student to read their reports.
              </p>
              <a className="link-arrow" href="#" onClick={onOpenStudentAnalysis}>
                Go to student analysis
                <Icon name="arrowRight" size={16} />
              </a>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default InstructorDashboard
