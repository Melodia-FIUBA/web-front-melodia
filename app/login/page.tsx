'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) window.location.href = '/admin/catalog'
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow rounded flex flex-col gap-3">
        <h1 className="text-xl font-bold">Iniciar sesión</h1>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="border p-2"/>
        <button className="bg-blue-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  )
}