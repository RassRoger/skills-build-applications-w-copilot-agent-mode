import { useEffect, useState } from 'react'
import CollectionStatus from './CollectionStatus.jsx'
import { API_BASE_URL, normalizeCollectionResponse } from '../utils/api.js'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Request failed with HTTP ${response.status}.`)
        }
        setUsers(normalizeCollectionResponse(await response.json()))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load users.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadUsers()
    return () => controller.abort()
  }, [])

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Meet the community</p>
        <h1>Users</h1>
        <p className="section-description">Every fitness journey is better with company.</p>
      </div>
      <CollectionStatus loading={loading} error={error} isEmpty={!users.length}>
        <div className="table-responsive tracker-table-wrap">
          <table className="table tracker-table align-middle">
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Fitness goal</th>
                <th scope="col">Team</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <span className="d-block fw-semibold">{user.name}</span>
                    <span className="small text-secondary">{user.email}</span>
                  </td>
                  <td>{user.fitnessGoal || 'Goal not set'}</td>
                  <td>{user.team?.name || 'Independent athlete'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollectionStatus>
    </section>
  )
}

export default Users
