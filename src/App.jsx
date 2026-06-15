import React, { useState } from 'react'

const seedConstraints = {
  'energy-storage': [
    { id: 'c1', assumption: 'Energy density requires heavy materials', borrowedFrom: 'lead-acid batteries (automotive)', provocation: 'Does mass still need to be the price of capacity?', crackHint: 'Supercapacitors and structural batteries decouple the two.' },
    { id: 'c2', assumption: 'Batteries must be charged from a central grid', borrowedFrom: 'early electric utilities', provocation: 'What if the storage medium itself generates or harvests?', crackHint: 'Flow batteries and redox couples can be recharged chemically.' },
  ],
  desalination: [
    { id: 'c1', assumption: 'Pure water requires energy-intensive phase change or pressure', borrowedFrom: 'industrial distillation (petroleum)', provocation: 'Does purification still need to be a high-energy industrial process?', crackHint: 'Biological membranes operate at ambient conditions.' },
  ],
  'cement-steel': [
    { id: 'c1', assumption: 'Structural load-bearing requires mass', borrowedFrom: 'stone masonry', provocation: 'Is compressive mass still the only reliable mechanism?', crackHint: 'Tensile composites and tensegrity allow far lighter structures.' },
  ],
}

export default function App() {
  const [selectedDomain, setSelectedDomain] = useState('energy-storage')
  const [customDomain, setCustomDomain] = useState('')
  const [constraints, setConstraints] = useState(seedConstraints)
  const [challenged, setChallenged] = useState([])
  const [flipped, setFlipped] = useState({})
  const [reflections, setReflections] = useState({})

  const currentDomainId = customDomain || selectedDomain
  const currentConstraints = constraints[currentDomainId] || []

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain)
    setCustomDomain('')
  }

  const handleCustomDomain = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const slug = e.target.value.trim().toLowerCase().replace(/\s+/g, '-')
      const id = 'custom-' + slug
      setCustomDomain(id)
      if (!constraints[id]) {
        setConstraints(prev => ({ ...prev, [id]: [] }))
      }
      setSelectedDomain('')
      e.target.value = ''
    }
  }

  const addCustomConstraint = (assumption) => {
    const newId = 'custom-' + Date.now()
    const newConstraint = {
      id: newId,
      assumption,
      borrowedFrom: 'user-defined',
      provocation: 'Does this constraint still apply here?',
      crackHint: ''
    }
    setConstraints(prev => ({
      ...prev,
      [currentDomainId]: [...(prev[currentDomainId] || []), newConstraint]
    }))
    return newId
  }

  const getFlipKey = (constraintId) => `${currentDomainId}:${constraintId}`

  const toggleFlip = (constraintId) => {
    const key = getFlipKey(constraintId)
    setFlipped(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const updateReflection = (constraintId, text) => {
    const key = getFlipKey(constraintId)
    setReflections(prev => ({ ...prev, [key]: text }))
  }

  const challengeConstraint = (constraint) => {
    const key = getFlipKey(constraint.id)
    const reflection = reflections[key] || ''
    const challengeId = Date.now().toString(36) + Math.random().toString(36).slice(2)

    const newEntry = {
      challengeId,
      domainId: currentDomainId,
      constraintId: constraint.id,
      assumption: constraint.assumption,
      borrowedFrom: constraint.borrowedFrom,
      provocation: constraint.provocation,
      crackHint: constraint.crackHint,
      reflection,
      recombinations: { status: 'idle', items: [] }
    }

    setChallenged(prev => [...prev, newEntry])
    setFlipped(prev => ({ ...prev, [key]: false }))
  }

  const generateRecombinations = (challengeId) => {
    // Board reflections are immutable after creation — no staleness race possible here.
    setChallenged(prev =>
      prev.map(e => {
        if (e.challengeId !== challengeId) return e
        return { ...e, recombinations: { status: 'loading', items: [] } }
      })
    )

    setTimeout(() => {
      setChallenged(prev =>
        prev.map(e => {
          if (e.challengeId !== challengeId) return e
          return {
            ...e,
            recombinations: {
              status: 'done',
              items: [
                { sourceField: 'Biology', mechanism: 'Aquaporins', prompt: 'Apply selective membrane channels instead of bulk pressure.' },
                { sourceField: 'Computing', mechanism: 'Caching', prompt: 'Pre-compute and store clean water in distributed micro-units.' }
              ]
            }
          }
        })
      )
    }, 900)
  }

  return (
    <div className="app">
      <h1>Borrowed Constraints</h1>
      <p className="subtitle">Spot the assumptions your field inherited from somewhere else.</p>

      <div className="domain-selector">
        {Object.keys(seedConstraints).map(d => (
          <button
            key={d}
            className={`domain-btn ${selectedDomain === d && !customDomain ? 'active' : ''}`}
            onClick={() => handleDomainSelect(d)}
          >
            {d.replace(/-/g, ' ')}
          </button>
        ))}
        <input
          className="input"
          placeholder="or type a new domain + Enter"
          onKeyDown={handleCustomDomain}
        />
      </div>

      {currentConstraints.length === 0 ? (
        <div className="card">
          <p>No seeded constraints for this domain yet.</p>
          <input
            className="input"
            placeholder="Describe one inherited assumption..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                const id = addCustomConstraint(e.target.value.trim())
                e.target.value = ''
                setTimeout(() => {
                  const key = getFlipKey(id)
                  setFlipped(prev => ({ ...prev, [key]: true }))
                }, 50)
              }
            }}
          />
        </div>
      ) : (
        <div className="cards">
          {currentConstraints.map(constraint => {
            const key = getFlipKey(constraint.id)
            const isFlipped = !!flipped[key]
            return (
              <div key={constraint.id} className="card">
                <div className="card-header">
                  <div className="assumption">{constraint.assumption}</div>
                  <button
                    className="flip-btn"
                    aria-expanded={isFlipped}
                    onClick={() => toggleFlip(constraint.id)}
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
                      value={reflections[key] || ''}
                      onChange={(e) => updateReflection(constraint.id, e.target.value)}
                      ref={node => { if (node) node.focus() }}
                    />
                    <button onClick={() => challengeConstraint(constraint)} style={{ marginTop: 12 }}>
                      Add to idea board
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {challenged.length > 0 && (
        <div className="idea-board">
          <h2>Idea Board</h2>
          {challenged.map(entry => (
            <div key={entry.challengeId} className="challenge-item">
              <strong>{entry.assumption}</strong>
              <div className="meta">{entry.borrowedFrom}</div>
              {entry.reflection && <p>{entry.reflection}</p>}
              {entry.crackHint && <div className="meta">Crack hint: {entry.crackHint}</div>}

              {entry.recombinations.status === 'idle' && (
                <button onClick={() => generateRecombinations(entry.challengeId)}>
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
      )}
    </div>
  )
}
