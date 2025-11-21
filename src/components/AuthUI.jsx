import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AuthUI() {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [message, setMessage] = useState('')

  const signup = async () => {
    setMessage('')
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    const data = await res.json()
    if (!res.ok) { setMessage(data.detail || 'Signup failed'); return }
    setToken(data.access_token)
    setMessage('Signed up successfully. Token stored.')
  }

  const login = async () => {
    setMessage('')
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)

    const res = await fetch(`${API_BASE}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    })
    const data = await res.json()
    if (!res.ok) { setMessage(data.detail || 'Login failed'); return }
    setToken(data.access_token)
    setMfaRequired(data.mfa_required)
    setMessage(data.mfa_required ? 'MFA required. Check your authenticator and enter code.' : 'Logged in!')
  }

  const verifyMfa = async () => {
    const res = await fetch(`${API_BASE}/auth/verify-mfa`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: mfaCode })
    })
    const data = await res.json()
    if (!res.ok) { setMessage(data.detail || 'MFA verify failed'); return }
    setToken(data.access_token)
    setMfaRequired(false)
    setMessage('MFA verified. Logged in!')
  }

  const enableMfa = async () => {
    const res = await fetch(`${API_BASE}/auth/enable-mfa`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) { setMessage(data.detail || 'Enable MFA failed'); return }
    setMessage(`MFA enabled. Add to app using URI: ${data.uri}`)
  }

  const me = async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setMessage(JSON.stringify(data))
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('signup')} className={`px-3 py-1 rounded ${mode==='signup'?'bg-blue-600 text-white':'bg-slate-700 text-blue-200'}`}>Signup</button>
        <button onClick={() => setMode('login')} className={`px-3 py-1 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-slate-700 text-blue-200'}`}>Login</button>
      </div>

      <div className="grid gap-3">
        <input className="px-3 py-2 rounded bg-slate-900/60 text-blue-100" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-blue-100" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {mode==='signup' && (
          <input className="px-3 py-2 rounded bg-slate-900/60 text-blue-100" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        )}

        {mode==='signup' ? (
          <button onClick={signup} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">Create account</button>
        ) : (
          <button onClick={login} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">Login</button>
        )}

        {mfaRequired && (
          <div className="mt-2 grid gap-2">
            <input className="px-3 py-2 rounded bg-slate-900/60 text-blue-100" placeholder="MFA code" value={mfaCode} onChange={e=>setMfaCode(e.target.value)} />
            <button onClick={verifyMfa} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white">Verify MFA</button>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button onClick={enableMfa} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-white">Enable MFA</button>
          <button onClick={me} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-blue-100">Who am I?</button>
        </div>

        {message && <div className="text-blue-200 text-sm mt-3 break-all">{message}</div>}
      </div>
    </div>
  )
}
