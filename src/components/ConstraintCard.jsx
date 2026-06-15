import React from 'react'

export default function ConstraintCard({
  constraint,
  isFlipped,
  reflection,
  onToggleFlip,
  onUpdateReflection,
  onChallenge,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="assumption">{constraint.assumption}</div>
        <button
          className="flip-btn"
          aria-expanded={isFlipped}
          onClick={onToggleFlip}
        >
          {isFlipped ? 'Close' : 'Challenge'}
        </button>
      </div>
      <div className="meta">Borrowed from: {constraint.borrowedFrom}</div>
      <div className="provocation">{constraint.provocation}</div>

      {isFlipped && (
        <div className="reflection-box">
          <textarea
            autoFocus
            aria-label="Your reflection on this assumption"
            placeholder="Your reflection (optional)"
            value={reflection}
            onChange={(e) => onUpdateReflection(e.target.value)}
          />
          <button onClick={onChallenge} style={{ marginTop: 12 }}>
            Add to idea board
          </button>
        </div>
      )}
    </div>
  )
}
