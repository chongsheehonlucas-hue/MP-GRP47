import { useEffect, useState } from 'react'
import '../instructors_analysis.css'

function scoreToPercentage(value) {
    return value == null ? '-' : `${value}%`
}

function InstructorAnalysis() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [refresh, setRefresh] = useState(0)
    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        setError('')
        setData(null)
        setSelectedStudent(null)
        fetch('/api/instructor/analytics', {
            credentials: 'include',
            signal: controller.signal
        })
        .then(async response => {
            if (!response.ok) {
                const result = await response.json().catch(() => ({}))
                throw new Error(result.detail || 'Unable to load student analysis.')
            }
            return response.json()
        })
        .then(result => {
            setData(result)
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                setError(error.message)
        }
        })
        .finally(() => {
            if (!controller.signal.aborted) {
                setLoading(false)
            }
        })

    return () => controller.abort()
  }, [refresh])

  const students = (data?.students || []).filter(student => {
    const text = `${student.display_name} ${student.student_number}`

    return text.toLowerCase().includes(search.toLowerCase())
  })

  const completedStudents = data
    ? data.students.filter(student =>
        data.modules.length > 0 &&
        student.assessed === data.modules.length
      ).length
    : 0

  const needsSupport = data
    ? data.students.filter(student =>
        student.average != null && student.average < 60
      ).length
    : 0

  function getStudentStatus(student) {
    if (student.assessed === 0) return 'Not started'

    if (student.average < 60) return 'Needs support'

    if (student.assessed === data.modules.length) {
      return 'Completed'
    }

    return 'In progress'
  }
  return (
    <div className="instructor-analysis">
      <header className="analysis-header">
        <div className="analysis-brand">
          <span className="analysis-logo" aria-hidden="true">
            ◎
          </span>

          <div>
            <strong>Case Readiness</strong>
            <small>Digital Forensics Case Preparation</small>
          </div>
        </div>

        <span className="analysis-navigation">
          Student Analysis
        </span>

        <span className="analysis-role">
          Instructor
        </span>
      </header>

      <main className="analysis-content">
        <div className="analysis-heading">
          <div>
            <p className="analysis-eyebrow">
              INSTRUCTOR DASHBOARD
            </p>

            <h1>Student analysis</h1>

            <p>
              View learner progress and assessment performance
              across the four learning modules.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => setRefresh(value => value + 1)}
          >
            Refresh results
          </button>
        </div>

        {loading && (
          <p className="analysis-message" role="status">
            Loading student results…
          </p>
        )}

        {error && (
          <div className="analysis-error" role="alert">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setRefresh(value => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {data && (
          <>
            <section
              className="analysis-summary"
              aria-label="Student summary"
            >
              <article className="analysis-stat">
                <p>Total students</p>
                <strong>{data.total_students}</strong>
                <small>Registered in the analysis database</small>
              </article>

              <article className="analysis-stat">
                <p>Average score</p>
                <strong>
                  {scoreToPercentage(data.average_score)}
                </strong>
                <small>Average of assessed learner averages</small>
              </article>

              <article className="analysis-stat">
                <p>All modules assessed</p>
                <strong>{completedStudents}</strong>
                <small>Results submitted in every module</small>
              </article>

              <article className="analysis-stat">
                <p>Needs support</p>
                <strong>{needsSupport}</strong>
                <small>Learner average below 60%</small>
              </article>
            </section>

            <section className="analysis-panel">
              <div className="analysis-section-heading">
                <div>
                  <p className="analysis-eyebrow">
                    PART 1 · LEARN
                  </p>

                  <h2>Performance by module</h2>
                </div>

                <span>Latest assessment results</span>
              </div>

              <div className="analysis-modules">
                {data.modules.map(module => (
                  <article
                    className="analysis-module"
                    key={module.module_id}
                  >
                    <p className="analysis-eyebrow">
                      MODULE {module.module_id}
                    </p>

                    <h3>{module.title}</h3>

                    <strong className="analysis-module-score">
                      {scoreToPercentage(module.average)}
                    </strong>

                    <small>Average score</small>

                    <progress
                      value={module.average ?? 0}
                      max="100"
                      aria-label={
                        `${module.title}: ${
                          scoreToPercentage(module.average)
                        } average`
                      }
                    />

                    <p>
                      {module.assessed} learners assessed
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="analysis-panel">
              <div className="analysis-section-heading">
                <div>
                  <p className="analysis-eyebrow">
                    LEARNER PROGRESS
                  </p>

                  <h2>Student overview</h2>
                </div>

                <span>
                  {students.length} students shown
                </span>
              </div>

              <label className="analysis-search">
                Search learners

                <input
                  type="search"
                  placeholder="Search name or student number"
                  value={search}
                  onChange={event =>
                    setSearch(event.target.value)
                  }
                />
              </label>

              <div className="analysis-table-wrapper">
                <table className="analysis-table">
                  <thead>
                    <tr>
                      <th scope="col">Student</th>
                      <th scope="col">Cohort</th>
                      <th scope="col">Average score</th>
                      <th scope="col">Modules assessed</th>
                      <th scope="col">Status</th>
                      <th scope="col">Results</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map(student => {
                      const status = getStudentStatus(student)

                      return (
                        <tr key={student.learner_id}>
                          <td>
                            <strong>
                              {student.display_name}
                            </strong>

                            <small>
                              {student.student_number}
                            </small>
                          </td>

                          <td>{student.cohort}</td>

                          <td>
                            {scoreToPercentage(student.average)}
                          </td>

                          <td>
                            {student.assessed}
                            {' / '}
                            {data.modules.length}
                          </td>

                          <td>
                            <span
                              className={
                                `analysis-status ${
                                  status === 'Needs support'
                                    ? 'analysis-status-support'
                                    : ''
                                }`
                              }
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              aria-label={
                                `View results for ${
                                  student.display_name
                                }`
                              }
                              onClick={() =>
                                setSelectedStudent(student)
                              }
                            >
                              View results
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {students.length === 0 && (
                <p className="analysis-message">
                  No learners found.
                </p>
              )}
            </section>

            {selectedStudent && (
              <section
                className="analysis-panel"
                aria-label="Individual student results"
              >
                <div className="analysis-section-heading">
                  <div>
                    <p className="analysis-eyebrow">
                      {selectedStudent.student_number}
                    </p>

                    <h2>
                      {selectedStudent.display_name}
                    </h2>

                    <p>{selectedStudent.cohort}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Close results
                  </button>
                </div>

                <div className="analysis-modules">
                  {data.modules.map(module => {
                    const result =
                      selectedStudent.results.find(
                        item =>
                          item.module_id === module.module_id
                      )

                    return (
                      <article
                        className="analysis-module"
                        key={module.module_id}
                      >
                        <h3>{module.title}</h3>

                        <strong className="analysis-module-score">
                          {scoreToPercentage(result?.percentage)}
                        </strong>

                        <p>
                          {result
                            ? `${result.points_earned} / ${
                                result.points_possible
                              } marks`
                            : 'Not assessed yet'}
                        </p>
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            <p className="analysis-note">
              Results use the latest attempt for each module.
              Missing assessments are excluded from averages.
              “Completed” means all module assessments were
              submitted, regardless of score. The 60% support
              threshold is a demo setting.
            </p>
          </>
        )}
      </main>
    </div>
  )
}

export default InstructorAnalysis