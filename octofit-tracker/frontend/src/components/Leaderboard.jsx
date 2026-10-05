import { useEffect, useState } from 'react'
import CollectionStatus from './CollectionStatus.jsx'
import { API_BASE_URL, normalizeCollectionResponse } from '../utils/api.js'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadLeaderboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Request failed with HTTP ${response.status}.`)
        }
        setEntries(normalizeCollectionResponse(await response.json()))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load the leaderboard.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()
    return () => controller.abort()
  }, [])

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Celebrate the effort</p>
        <h1>Leaderboard</h1>
        <p className="section-description">Friendly competition, powered by consistency.</p>
      </div>
      <CollectionStatus loading={loading} error={error} isEmpty={!entries.length}>
        <div className="leaderboard-list">
          {entries.map((entry, index) => (
            <article className="leaderboard-row" key={entry._id}>
              <span className="rank-badge">{String(index + 1).padStart(2, '0')}</span>
              <div className="flex-grow-1">
                <h2>{entry.user?.name || 'OctoFit member'}</h2>
                <p>{entry.team?.name || 'Independent athlete'}</p>
              </div>
              <strong className="points-value">{entry.points} pts</strong>
            </article>
          ))}
        </div>
      </CollectionStatus>
    </section>
  )
}

export default Leaderboard
