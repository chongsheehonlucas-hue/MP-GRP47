// StepStrip.jsx
// The white box near the top with three steps: Learn -> Apply -> Review.
// "steps" is a list of 3 items, each with a label, a title and a status line.
// "currentStep" (1, 2 or 3) decides which number circle is filled in navy.

import Icon from './Icon.jsx'

function StepStrip({ steps, currentStep }) {
  return (
    <div className="steps">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isLastStep = stepNumber === steps.length

        let circleClass = 'step__num'
        if (stepNumber === currentStep) {
          circleClass = 'step__num step__num--current'
        }

        return (
          <div className="step" key={step.label}>
            <span className={circleClass}>{stepNumber}</span>

            <div className="step__text">
              <span className="label">{step.label}</span>
              <span className="step__title">{step.title}</span>
              <span className="step__status">{step.status}</span>
            </div>

            {/* An arrow after every step except the last one */}
            {!isLastStep && (
              <span className="step__arrow">
                <Icon name="arrowRight" size={20} />
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepStrip
