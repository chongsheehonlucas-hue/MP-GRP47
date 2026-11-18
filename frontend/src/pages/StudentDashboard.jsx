// StudentDashboard.jsx
// The student's home page after login. Built to match the approved student design.
// All numbers come from STUDENT_SAMPLE for now. Later they will come from the database.

import '../styles/tokens.css'
import '../styles/dashboard.css'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import StepStrip from '../components/StepStrip.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Icon from '../components/Icon.jsx'
import { MODULES, CASES } from '../data/courseContent.js'
import { STUDENT_SAMPLE } from '../data/studentSample.js'
import { NOT_BUILT_YET } from '../data/links.js'

/* ---------- Calculations (design spec, section 4.7) ---------- */

// Percentage of one module done, e.g. 2 of 6 sub-modules = 33
function getModulePercent(module, done) {
  return Math.round((done / module.subModuleCount) * 100)
}

// The "next module" is the first module (1 to 4) that is not complete yet.
// Returns null if every module is complete.
function getNextModuleId(subModulesDone) {
  for (const module of MODULES) {
    if (subModulesDone[module.id] < module.subModuleCount) {
      return module.id
    }
  }
  return null
}

/* ---------- One module card ---------- */

function ModuleCard({ module, done, isNext }) {
  const percent = getModulePercent(module, done)
  const isComplete = done === module.subModuleCount
  const isNotStarted = done === 0

  // Status at the top right of the card
  let status = null // the design has no label for "in progress but not next", so show nothing
  if (isNext) {
    status = <span className="chip chip--accent">Up next</span>
  } else if (isComplete) {
    status = (
      <span className="chip">
        <Icon name="tick" size={14} strokeWidth={2.5} />
        Complete
      </span>
    )
  } else if (isNotStarted) {
    status = <span className="status-text">Not started</span>
  }

  // Text above the progress bar
  let progressText = done + ' of ' + module.subModuleCount + ' sub-modules done'
  if (isComplete) {
    progressText = 'Complete'
  } else if (isNotStarted) {
    progressText = 'Not started'
  }

  // Button label: Review (complete), Start (not started) or Continue (in progress)
  let buttonLabel = 'Continue'
  if (isComplete) {
    buttonLabel = 'Review'
  } else if (isNotStarted) {
    buttonLabel = 'Start'
  }

  // The next module gets a navy border and a dark button with an arrow
  let cardClass = 'card module-card'
  let buttonClass = 'btn btn--secondary'
  if (isNext) {
    cardClass = 'card module-card module-card--next'
    buttonClass = 'btn btn--primary'
  }

  return (
    <article className={cardClass}>
      <div className="card__top">
        <span className="icon-tile">
          <Icon name={module.icon} size={22} strokeWidth={1.8} />
        </span>
        {status}
      </div>

      <div className="card__text">
        <span className="label">{module.code}</span>
        <h3 className="module-card__title">{module.title}</h3>
        <p className="module-card__desc">{module.description}</p>
      </div>

      <div className="card__bottom">
        <div className="progress-row">
          <span>{progressText}</span>
          <span>{percent}%</span>
        </div>
        <ProgressBar percent={percent} label={module.title + ' progress'} />

        <div className="card__actions">
          <a className={buttonClass} href={NOT_BUILT_YET} aria-label={buttonLabel + ' ' + module.title}>
            {buttonLabel}
            {isNext && <Icon name="arrowRight" size={18} />}
          </a>
        </div>
      </div>
    </article>
  )
}

/* ---------- One case scenario card ---------- */

function CaseCard({ caseItem }) {
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

      <div className="tags">
        <span className="tag">Beginner</span>
        <span className="tag">4 stages</span>
      </div>

      <div className="card__bottom">
        <a className="btn btn--secondary btn--full" href={NOT_BUILT_YET} aria-label={'Start case: ' + caseItem.title}>
          Start case
        </a>
      </div>
    </article>
  )
}

/* ---------- The whole page ---------- */

// userName: the logged-in student's name (App.jsx sends it in).
// onLogout: what Log out does (App.jsx sends this in).
function StudentDashboard({ userName, onLogout }) {
  const student = STUDENT_SAMPLE
  const displayName = userName || student.name // use the real name if we have one

  // Work out the numbers shown on the page
  let modulesDone = 0
  let percentTotal = 0
  for (const module of MODULES) {
    const percent = getModulePercent(module, student.subModulesDone[module.id])
    percentTotal = percentTotal + percent
    if (percent === 100) {
      modulesDone = modulesDone + 1
    }
  }
  const overallPercent = Math.round(percentTotal / MODULES.length) // average of the 4 modules
  const nextModuleId = getNextModuleId(student.subModulesDone)

  // Step strip text
  let learnStatus = modulesDone + ' of 4 modules complete'
  if (modulesDone === 0) {
    learnStatus = 'Start here'
  }
  let reviewStatus = 'No reports yet'
  if (student.reportCount > 0) {
    reviewStatus = student.reportCount + ' reports'
  }
  const steps = [
    { label: 'Part 1 · Learn', title: 'Work through the 4 modules', status: learnStatus },
    { label: 'Part 2 · Apply', title: 'Solve case scenarios with hidden traps', status: student.casesAttempted + ' of 3 cases attempted' },
    { label: 'Review', title: 'AI Result', status: reviewStatus },
  ]
  // Step 1 stays filled until all 4 modules are done, then step 2
  let currentStep = 1
  if (modulesDone === 4) {
    currentStep = 2
  }

  const menuLinks = [
    { label: 'Home', href: '#', isCurrent: true }, // you are already on Home
    { label: 'Quiz history', href: NOT_BUILT_YET, isCurrent: false },
  ]

  return (
    <div className="app">
      <Header
        searchPlaceholder="Search modules, topics or cases"
        menuLinks={menuLinks}
        userName={displayName}
        roleLabel="Student"
        onLogout={onLogout}
      />

      <main className="page">
        {/* Greeting */}
        <div className="greeting">
          <span className="label">Student dashboard</span>
          {student.isFirstLogin ? (
            <>
              <h1 className="h1">Welcome, {displayName}.</h1>
              <p className="greeting__intro">
                Before any digital investigation, you need the right authority, a clear scope, a plan for fragile
                evidence and the right kit. Learn all four here, then test yourself on realistic cases.
              </p>
            </>
          ) : (
            <h1 className="h1">Welcome back, {displayName}.</h1>
          )}
        </div>

        <StepStrip steps={steps} currentStep={currentStep} />

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
                    Each module explains what to do, why it matters, and what goes wrong in real cases when a step is
                    skipped. Every lesson follows the same three steps: Learn, Try, Check.
                  </p>
                </div>
              </div>

              <div className="card-grid">
                {MODULES.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    done={student.subModulesDone[module.id]}
                    isNext={module.id === nextModuleId}
                  />
                ))}
              </div>
            </section>

            {/* Case scenarios (id="cases" lets the side card link jump here) */}
            <section className="section" id="cases" aria-labelledby="cases-heading">
              <div className="section-head">
                <div className="section-head__text">
                  <span className="label">Part 2 · Apply</span>
                  <h2 className="h2" id="cases-heading">Case scenarios</h2>
                  <p className="lead">
                    Each case takes you through all four stages in order: legal, scoping, risk, then equipment.
                    Somewhere in each one is a trap, like a warrant that misses a device at the scene. Catch it before
                    you move on.
                  </p>
                </div>
                <span className="chip">Recommended after all 4 modules</span>
              </div>

              <div className="card-grid">
                {CASES.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            </section>
          </div>

          {/* ===== Side column ===== */}
          <aside className="layout__aside">
            {/* a) Your progress */}
            <section className="card side-card">
              <h2 className="h2 h2--small">Your progress</h2>
              <div>
                <span className="big-stat">{overallPercent}%</span>
                <p className="caption">of the 4 modules completed</p>
              </div>
              <ProgressBar percent={overallPercent} label="Overall module progress" isYellow={true} />
              <dl className="stat-grid stat-grid--single">
                <div className="stat-tile">
                  <dt>Modules done</dt>
                  <dd>{modulesDone} / 4</dd>
                </div>
              </dl>
            </section>

            {/* b) Recent knowledge checks */}
            <section className="card side-card">
              <h2 className="h2 h2--small">Recent knowledge checks</h2>
              {student.recentChecks.length === 0 ? (
                <p className="empty">Your scores show up here once you finish your first knowledge check.</p>
              ) : (
                <ul className="row-list">
                  {student.recentChecks.map((check) => (
                    <li key={check.code}>
                      <span className="row-list__text">
                        <span className="label">Module {check.code}</span>
                        <span className="row-list__title">{check.title}</span>
                      </span>
                      <span className="row-list__score">
                        {check.score} / {check.maxScore}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* c) AI Result Report */}
            <section className="card side-card">
              <h2 className="h2 h2--small side-card__heading">
                <Icon name="document" size={20} />
                AI Result Report
              </h2>
              {/* Open item: what this card shows once reports exist is not designed yet */}
              <p className="side-card__text">No reports yet. Finish a case scenario and your report will be saved here.</p>
              <a className="link-arrow" href="#cases">
                Go to case scenarios
                <Icon name="arrowRight" size={16} />
              </a>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default StudentDashboard
