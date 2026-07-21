'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  published: boolean
  createdAt: string
}

export function AdminBlogTable() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ slug: '', title: '', excerpt: '', content: '', category: 'Dicas' })

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(data => { setPosts(data.posts || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const post = await res.json()
        setPosts(prev => [post, ...prev])
        setShowForm(false)
        setForm({ slug: '', title: '', excerpt: '', content: '', category: 'Dicas' })
        toast.success('Post criado!')
      }
    } catch {
      toast.error('Erro ao criar post')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPost.id, ...form }),
      })
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...form } : p))
        setShowForm(false)
        setEditingPost(null)
        setForm({ slug: '', title: '', excerpt: '', content: '', category: 'Dicas' })
        toast.success('Post atualizado!')
      }
    } catch {
      toast.error('Erro ao atualizar post')
    }
  }

  const startEdit = (post: BlogPost) => {
    setEditingPost(post)
    setForm({ slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content || '', category: post.category })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id))
        toast.success('Post deletado!')
      }
    } catch {
      toast.error('Erro ao deletar post')
    }
  }

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-lg uppercase">Blog</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingPost(null); setForm({ slug: '', title: '', excerpt: '', content: '', category: 'Dicas' }) }} className="text-xs font-medium uppercase tracking-wider border border-border px-4 py-2 hover:bg-muted">
          {showForm ? 'Cancelar' : '+ Novo Post'}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={editingPost ? handleUpdate : handleCreate}
          className="bg-muted p-4 mb-6 space-y-3"
        >
          <input type="text" placeholder="Título" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" required />
          <input type="text" placeholder="Slug (url-friendly)" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" required />
          <input type="text" placeholder="Excerto" value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" />
          <textarea placeholder="Conteúdo (HTML)" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" rows={6} />
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black">
            <option>Dicas</option>
            <option>Moda</option>
            <option>Notícias</option>
          </select>
          <button type="submit" className="bg-black text-white text-xs font-medium uppercase tracking-wider px-6 py-2">{editingPost ? 'Salvar Alterações' : 'Criar Post'}</button>
        </motion.form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Título</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Categoria</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Data</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-border">
                <td className="p-3 font-medium">{post.title}</td>
                <td className="p-3 text-muted-foreground">{post.category}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(post)} className="text-xs text-blue-500 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(post.id)} className="text-xs text-red-500 hover:underline">Deletar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">Nenhum post.</p>}
      </div>
    </div>
  )
}
