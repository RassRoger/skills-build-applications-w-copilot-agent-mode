function CollectionStatus({ loading, error, isEmpty, children }) {
  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 py-5 text-secondary" role="status">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
        Loading tracker data…
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Couldn’t load this section.</strong> {error}
      </div>
    )
  }

  if (isEmpty) {
    return <div className="empty-state">No records yet. Check back after data has been added.</div>
  }

  return children
}

export default CollectionStatus
