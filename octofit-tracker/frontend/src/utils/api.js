const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function normalizeCollectionResponse(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('The API returned an unsupported collection response.')
  }

  for (const key of ['results', 'items', 'records', 'data']) {
    const value = payload[key]
    if (Array.isArray(value)) {
      return value
    }
    if (value && typeof value === 'object') {
      return normalizeCollectionResponse(value)
    }
  }

  throw new Error('The API response did not contain a collection.')
}
