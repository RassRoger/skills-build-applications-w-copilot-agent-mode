import { useEffect, useState } from 'react'
import CollectionStatus from './CollectionStatus.jsx'
import { API_BASE_URL, normalizeCollectionResponse } from '../utils/api.js'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/workouts/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Request failed with HTTP ${response.status}.`)
        }
        setWorkouts(normalizeCollectionResponse(await response.json()))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load workouts.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()
    return () => controller.abort()
  }, [])

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">A little inspiration</p>
        <h1>Workouts</h1>
        <p className="section-description">Find a session that fits your goals and your day.</p>
      </div>
      <CollectionStatus loading={loading} error={error} isEmpty={!workouts.length}>
        <div className="row g-4">
          {workouts.map((workout) => (
            <div className="col-md-6 col-xl-4" key={workout._id}>
              <article className="tracker-card workout-card h-100">
                <span className="card-kicker">{workout.goal || 'Your next session'}</span>
                <h2>{workout.title}</h2>
                <p className="text-secondary">{workout.description}</p>
                <div className="workout-meta">
                  <span>{workout.difficulty || 'All levels'}</span>
                  {workout.durationMinutes && <span>{workout.durationMinutes} min</span>}
                </div>
              </article>
            </div>
          ))}
        </div>
      </CollectionStatus>
    </section>
  )
}

export default Workouts
