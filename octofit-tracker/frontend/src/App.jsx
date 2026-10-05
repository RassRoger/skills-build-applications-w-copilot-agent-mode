import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import logo from '../../../docs/octofitapp-small.png'
import './App.css'

const navigation = [
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Teams', path: '/teams' },
  { label: 'Users', path: '/users' },
  { label: 'Workouts', path: '/workouts' },
]

function Home() {
  return (
    <section className="home-hero">
      <p className="eyebrow">Move together. Get stronger.</p>
      <h1>Your progress, in motion.</h1>
      <p className="home-copy">
        Track your activity, find your team, and celebrate every step toward
        your fitness goals.
      </p>
      <Link className="btn btn-primary btn-lg" to="/activities">
        Explore activities
      </Link>
      <div className="home-links" aria-label="Tracker sections">
        {navigation.map(({ label, path }) => (
          <Link key={path} to={path}>
            {label}
          </Link>
        ))}
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <div className="alert alert-warning" role="alert">
      <h1 className="h4">Page not found</h1>
      <p className="mb-0">
        That section is not available. <Link to="/">Return to the dashboard</Link>.
      </p>
    </div>
  )
}

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar navbar-expand-lg app-navbar" aria-label="Main navigation">
          <div className="container">
            <Link className="navbar-brand brand-lockup" to="/">
              <img src={logo} alt="" width="44" height="44" />
              <span>OctoFit <strong>Tracker</strong></span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#main-navigation"
              aria-controls="main-navigation"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="main-navigation">
              <div className="navbar-nav ms-auto">
                {navigation.map(({ label, path }) => (
                  <NavLink
                    key={path}
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                    to={path}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="container app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container">Small steps add up. Keep moving.</div>
      </footer>
    </div>
  )
}

export default App
