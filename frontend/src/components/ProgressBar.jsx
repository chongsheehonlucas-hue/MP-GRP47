// ProgressBar.jsx
// A thin bar that fills up to a percentage.
// Example: <ProgressBar percent={33} label="Equipment Readiness progress" />
// Add isYellow={true} for the big yellow bar in the side column.

function ProgressBar({ percent, label, isYellow = false }) {
  let fillClass = 'progress__fill'
  if (isYellow) {
    fillClass = 'progress__fill progress__fill--accent'
  }

  return (
    // role and aria-... tell screen readers what the bar shows
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* style={{ width: ... }} sets the width directly, because it changes with the data */}
      <div className={fillClass} style={{ width: percent + '%' }}></div>
    </div>
  )
}

export default ProgressBar
