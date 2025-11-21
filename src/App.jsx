import AuthUI from './components/AuthUI'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Trading Platform Starter</h1>
            <p className="text-blue-200">JWT auth with MFA + role-based access wired up. Use this to begin building the rest.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <AuthUI />
            </div>
            <div className="bg-slate-800/40 border border-blue-500/20 rounded-2xl p-6 text-blue-200">
              <h3 className="text-white font-semibold mb-2">What’s included now</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Signup and login with JWT</li>
                <li>Enable and verify MFA (TOTP)</li>
                <li>Role-based protected routes</li>
              </ul>
              <h3 className="text-white font-semibold mt-4 mb-2">Next steps</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Connect market data and build dashboard widgets</li>
                <li>Add risk manager endpoints and UI</li>
                <li>Trade journal and analytics pages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App