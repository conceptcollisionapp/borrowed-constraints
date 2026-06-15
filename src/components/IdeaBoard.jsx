import React from 'react'

export default function IdeaBoard({ challenged, onGenerate }) {
  return (
    <div className="idea-board">
      <h2>Idea Board</h2>
      {challenged.map(entry => (
        <div key={entry.challengeId} className="challenge-item">
          <strong>{entry.assumption}</strong>
          <div className="meta">{entry.borrowedFrom}</div>
          {entry.reflection && <p>{entry.reflection}</p>}
          {entry.crackHint && (
            <div className="crack-hint">Crack hint: {entry.crackHint}</div>
          )}

          {entry.recombinations.status === 'idle' && (
            <button onClick={() => onGenerate(entry.challengeId)}>
              Generate recombinations
            </button>
          )}
          {entry.recombinations.status === 'loading' && <p>Thinking…</p>}
          {entry.recombinations.status === 'done' &&
            entry.recombinations.items.map((r, i) => (
              <div key={i} className="recomb">
                <strong>{r.sourceField}</strong> — {r.mechanism}<br />
                {r.prompt}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
