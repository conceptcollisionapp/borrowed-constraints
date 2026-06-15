import { useCallback } from 'react'

export default function useRecombinations(setChallenged) {
  const generateRecombinations = useCallback((challengeId) => {
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
                { sourceField: 'Biology', mechanism: 'Symbiosis', prompt: 'Borrow a cooperative mechanism instead of a competitive one.' },
                { sourceField: 'Computing', mechanism: 'Caching', prompt: 'Pre-compute or store the solution at the edge before the constraint is hit.' }
              ]
            }
          }
        })
      )
    }, 900)
  }, [setChallenged])

  return { generateRecombinations }
}
