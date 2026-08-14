'use client'

import { useState, useEffect } from 'react'

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  emailVerified: boolean
  createdAt: string
}

export function AdminCustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(data => { setCustomers(data.customers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search)
  )

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-lg uppercase">Clientes ({customers.length})</h2>
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou CPF..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-border px-3 py-2 text-sm w-64 focus:outline-none focus:border-black"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Nome</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">E-mail</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Telefone</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">CPF</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Verificado</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(customer => (
              <tr key={customer.id} className="border-b border-border">
                <td className="p-3 font-medium">{customer.name}</td>
                <td className="p-3 text-muted-foreground">{customer.email}</td>
                <td className="p-3 text-muted-foreground">{customer.phone || '-'}</td>
                <td className="p-3 text-muted-foreground font-mono text-xs">{customer.cpf || '-'}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${customer.emailVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {customer.emailVerified ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">Nenhum cliente encontrado.</p>}
      </div>
    </div>
  )
}
