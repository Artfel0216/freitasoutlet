'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type Comment = {
  id: string
  postSlug: string
  authorName: string
  content: string
  createdAt: string
}

interface BlogCommentsProps {
  postSlug: string
}

function getStoredComments(postSlug: string): Comment[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(`blog_comments_${postSlug}`)
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

export function BlogComments({ postSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(() => getStoredComments(postSlug))
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) {
      toast.error('Preencha nome e comentário')
      return
    }
    setLoading(true)

    const newComment: Comment = {
      id: crypto.randomUUID(),
      postSlug,
      authorName: name,
      content,
      createdAt: new Date().toISOString(),
    }

    const updated = [newComment, ...comments]
    setComments(updated)
    localStorage.setItem(`blog_comments_${postSlug}`, JSON.stringify(updated))
    setName('')
    setContent('')
    setShowForm(false)
    toast.success('Comentário publicado!')
    setLoading(false)
  }

  return (
    <div className="border-t border-border pt-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg uppercase tracking-tight">
          Comentários ({comments.length})
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs font-medium uppercase tracking-wider border border-border px-4 py-2 hover:bg-muted transition-colors"
          >
            Comentar
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-muted p-4 mb-6 overflow-hidden"
          >
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
                required
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Escreva seu comentário..."
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                rows={3}
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white text-xs font-medium uppercase tracking-wider px-4 py-2 hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-muted-foreground hover:text-black px-3"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum comentário ainda. Seja o primeiro!</p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-border pb-4 last:border-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold uppercase">
                  {comment.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground ml-11">{comment.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
