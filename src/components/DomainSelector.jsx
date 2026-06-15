import React from 'react'

export default function DomainSelector({
  seedConstraints,
  selectedDomain,
  customDomain,
  onDomainSelect,
  onCustomDomain,
}) {
  return (
    <div className="domain-selector">
      {Object.keys(seedConstraints).map(d => (
        <button
          key={d}
          className={`domain-btn ${selectedDomain === d && !customDomain ? 'active' : ''}`}
          onClick={() => onDomainSelect(d)}
        >
          {d.replace(/-/g, ' ')}
        </button>
      ))}
      <input
        className="input"
        placeholder="or type a new domain + Enter"
        aria-label="Create a custom domain"
        onKeyDown={onCustomDomain}
      />
    </div>
  )
}
