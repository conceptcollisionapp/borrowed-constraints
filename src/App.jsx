import React, { useState } from 'react'
import seedConstraints from './data/seedConstraints.js'
import DomainSelector from './components/DomainSelector.jsx'
import ConstraintCard from './components/ConstraintCard.jsx'
import IdeaBoard from './components/IdeaBoard.jsx'
import useRecombinations from './hooks/useRecombinations.js'

export default function App() {
  const [selectedDomain, setSelectedDomain] = useState('energy-storage')
  const [customDomain, setCustomDomain] = useState('')
  const [constraints, setConstraints] = useState(seedConstraints)
  const [challenged, setChallenged] = useState([])
  const [flipped, setFlipped] = useState({})
  const [reflections, setReflections] = useState({})

  const currentDomainId = customDomain || selectedDomain
  const currentConstraints = constraints[currentDomainId] || []

  const { generateRecombinations } = useRecombinations(setChallenged)

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

  return (
    <div className="app">
      <h1>Borrowed Constraints</h1>
      <p className="subtitle">Spot the assumptions your field inherited from somewhere else.</p>

      <DomainSelector
        seedConstraints={seedConstraints}
        selectedDomain={selectedDomain}
        customDomain={customDomain}
        onDomainSelect={handleDomainSelect}
        onCustomDomain={handleCustomDomain}
      />

      {currentConstraints.length === 0 ? (
        <div className="card">
          <p>No seeded constraints for this domain yet.</p>
          <input
            className="input"
            placeholder="Describe one inherited assumption..."
            aria-label="Describe one inherited assumption"
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
          {currentConstraints.map(constraint => (
            <ConstraintCard
              key={constraint.id}
              constraint={constraint}
              isFlipped={!!flipped[getFlipKey(constraint.id)]}
              reflection={reflections[getFlipKey(constraint.id)] || ''}
              onToggleFlip={() => toggleFlip(constraint.id)}
              onUpdateReflection={(text) => updateReflection(constraint.id, text)}
              onChallenge={() => challengeConstraint(constraint)}
            />
          ))}
        </div>
      )}

      {challenged.length > 0 && (
        <IdeaBoard
          challenged={challenged}
          onGenerate={generateRecombinations}
        />
      )}
    </div>
  )
}
