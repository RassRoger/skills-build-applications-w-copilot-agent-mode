import { useEffect, useState } from 'react'
import CollectionStatus from './CollectionStatus.jsx'
import { API_BASE_URL, normalizeCollectionResponse } from '../utils/api.js'

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadActivities() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/activities/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Request failed with HTTP ${response.status}.`)
        }
        setActivities(normalizeCollectionResponse(await response.json()))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load activities.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadActivities()
    return () => controller.abort()
  }, [])

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Keep a steady rhythm</p>
        <h1>Activities</h1>
        <p className="section-description">A snapshot of the work you put in.</p>
      </div>
      <CollectionStatus loading={loading} error={error} isEmpty={!activities.length}>
        <div className="table-responsive tracker-table-wrap">
          <table className="table tracker-table align-middle">
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Athlete</th>
                <th scope="col">Duration</th>
                <th scope="col">Calories</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td className="fw-semibold">{activity.type}</td>
                  <td>{activity.user?.name || 'OctoFit member'}</td>
                  <td>{activity.durationMinutes} min</td>
                  <td>{activity.calories ?? 0} kcal</td>
                  <td>
                    {activity.date
                      ? new Date(activity.date).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollectionStatus>
    </section>
  )
}

export default Activities
