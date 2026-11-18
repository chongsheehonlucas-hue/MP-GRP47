// PlaceholderPage.jsx
// "Coming soon" page for links to pages that are not built yet.
// The page name comes from the address, e.g. placeholder.html?page=Quiz%20history

function PlaceholderPage() {
  // Read "page" from the address bar. If it is missing, use "This page".
  const params = new URLSearchParams(window.location.search)
  const pageName = params.get('page') || 'This page'

  return (
    <div className="app">
      <main className="placeholder">
        <div className="card placeholder__card">
          <span className="label">Coming soon</span>
          <h1 className="h2">{pageName}</h1>
          <p className="lead">This page isn't built yet. It's a placeholder so the dashboard links have somewhere to go.</p>
          <div>
            {/* Goes back to the page you came from */}
            <button className="btn btn--primary" type="button" onClick={() => window.history.back()}>
              Go back
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PlaceholderPage
