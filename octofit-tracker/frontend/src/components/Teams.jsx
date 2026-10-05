import { useEffect, useState } from 'react'
import CollectionStatus from './CollectionStatus.jsx'
import { API_BASE_URL, normalizeCollectionResponse } from '../utils/api.js'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeams() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teams/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Request failed with HTTP ${response.status}.`)
        }
        setTeams(normalizeCollectionResponse(await response.json()))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load teams.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTeams()
    return () => controller.abort()
  }, [])

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Better together</p>
        <h1>Teams</h1>
        <p className="section-description">Find your crew and keep each other moving.</p>
      </div>
      <CollectionStatus loading={loading} error={error} isEmpty={!teams.length}>
        <div className="row g-4">
          {teams.map((team) => (
            <div className="col-md-6" key={team._id}>
              <article className="tracker-card h-100">
                <span className="card-kicker">OctoFit crew</span>
                <h2>{team.name}</h2>
                <p className="text-secondary">{team.description || 'A team that moves together.'}</p>
                <div className="member-list">
                  <strong>{team.members?.length || 0} members</strong>
                  {team.members?.length > 0 && (
                    <ul className="list-unstyled mb-0 mt-2">
                      {team.members.map((member) => (
                        <li key={member._id || member}>{member.name || 'Team member'}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </CollectionStatus>
    </section>
  )
}

export default Teams
