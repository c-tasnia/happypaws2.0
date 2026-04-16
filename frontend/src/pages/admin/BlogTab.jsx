import { useState, useEffect } from 'react'
import api from '../../api'

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  tags: '',
  published: true,
}

const BlogTab = ({ getToken, showToast }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [previewPost, setPreviewPost] = useState(null)

  const fetchBlogs = async () => {
    try {
      const token = await getToken()
      const res = await api.get('/blogs', { headers: { Authorization: `Bearer ${token}` } })
      setBlogs(Array.isArray(res.data) ? res.data : [])
    } catch {
      showToast('Failed to load blogs', true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBlogs() }, [])

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingCover(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (!data.secure_url) { showToast('Cover upload failed', true); return }
      setForm(f => ({ ...f, cover_image: data.secure_url }))
      showToast('Cover image uploaded! ✅')
    } catch {
      showToast('Cover upload failed', true)
    } finally {
      setUploadingCover(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }
      const res = editingId
        ? await api.put(`/blogs/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } })
        : await api.post('/blogs', payload, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200 || res.status === 201) {
        showToast(editingId ? 'Blog updated! ✍️' : 'Blog published! 🎉')
        setForm(emptyForm); setEditingId(null); setShowForm(false)
        fetchBlogs()
      } else {
        showToast('Something went wrong', true)
      }
    } catch (err) {
      console.error(err)
      showToast('Something went wrong', true)
    }
  }

  const handleEdit = (blog) => {
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      cover_image: blog.cover_image || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      published: blog.published ?? true,
    })
    setEditingId(blog._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return
    const token = await getToken()
    await api.delete(`/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    showToast('Blog deleted')
    fetchBlogs()
  }

  const handleTogglePublish = async (blog) => {
    const token = await getToken()
    await api.patch(
      `/blogs/${blog._id}`,
      { published: !blog.published },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    showToast(blog.published ? 'Blog unpublished' : 'Blog published! 🎉')
    fetchBlogs()
  }

  if (loading) return (
    <div className="flex justify-center py-12">
      <span className="loading loading-spinner loading-md text-primary"></span>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-dark">Blog Posts ({blogs.length})</h2>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }}
          className="btn btn-sm text-white border-none bg-primary hover:bg-dark"
        >
          {showForm ? 'Cancel' : '✍️ Write Post'}
        </button>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="card bg-white border border-base-200 shadow-sm mb-8">
          <div className="card-body">
            <h3 className="font-serif text-lg font-bold text-dark mb-4">
              {editingId ? 'Edit Blog Post' : 'New Blog Post'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Title */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-dark">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="input input-bordered focus:outline-primary w-full"
                  placeholder="Give your post a great title..."
                  required
                />
              </div>

              {/* Cover Image */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-dark">Cover Image</label>
                <input
                  type="file" accept="image/*"
                  onChange={handleCoverUpload}
                  className="file-input file-input-bordered file-input-sm w-full"
                  disabled={uploadingCover}
                />
                {uploadingCover && <p className="text-xs text-primary mt-1">Uploading cover...</p>}
                {form.cover_image && (
                  <div className="mt-2 relative">
                    <img
                      src={form.cover_image}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                      className="absolute top-2 right-2 bg-error text-white rounded-full w-6 h-6 text-sm flex items-center justify-center"
                    >×</button>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-dark">Excerpt / Summary</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="textarea textarea-bordered focus:outline-primary w-full"
                  placeholder="Short description shown on blog listing..."
                  rows={2}
                />
              </div>

              {/* Content */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-dark">Content *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="textarea textarea-bordered focus:outline-primary w-full font-mono text-sm"
                  placeholder="Write your blog post here... You can use markdown-style formatting."
                  rows={14}
                  required
                />
                <p className="text-xs text-muted mt-1">Tip: Use blank lines to separate paragraphs.</p>
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-dark">Tags</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="input input-bordered input-sm focus:outline-primary w-full"
                  placeholder="adoption, rescue, cats  (comma-separated)"
                />
              </div>

              {/* Published toggle */}
              <div className="form-control flex-row items-center gap-3">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })}
                />
                <span className="text-sm font-semibold text-dark">
                  {form.published ? 'Published (visible to all)' : 'Draft (hidden from public)'}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn text-white border-none bg-primary hover:bg-dark">
                  {editingId ? 'Update Post' : 'Publish Post'}
                </button>
                <button
                  type="button"
                  onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(false) }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog list */}
      {blogs.length === 0 ? (
        <div className="card bg-white border border-base-200 shadow-sm">
          <div className="card-body text-center py-16">
            <p className="text-4xl mb-3">✍️</p>
            <p className="font-semibold text-dark">No blog posts yet</p>
            <p className="text-sm text-muted mt-1">Share your stories about the pets and your rescue journey!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map(blog => (
            <div key={blog._id} className="card bg-white border border-base-200 shadow-sm overflow-hidden">
              {blog.cover_image && (
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="card-body p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-serif font-bold text-dark text-base leading-snug">{blog.title}</h3>
                  <span className={`badge badge-sm shrink-0 font-semibold border-none ${
                    blog.published ? 'bg-light text-dark' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {blog.excerpt && (
                  <p className="text-sm text-muted line-clamp-2 mt-1">{blog.excerpt}</p>
                )}

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {blog.tags.map((tag, i) => (
                      <span key={i} className="badge badge-sm bg-base-200 text-dark border-none">{tag}</span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted mt-2">
                  {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => setPreviewPost(blog)}
                    className="btn btn-xs btn-ghost border border-base-300"
                  >👁 Preview</button>
                  <button
                    onClick={() => handleEdit(blog)}
                    className="btn btn-xs btn-outline border-primary text-primary hover:bg-primary hover:text-white"
                  >Edit</button>
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    className="btn btn-xs btn-outline border-base-400 text-dark hover:bg-base-200"
                  >{blog.published ? 'Unpublish' : 'Publish'}</button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="btn btn-xs btn-outline border-error text-error hover:bg-error hover:text-white"
                  >Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewPost(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {previewPost.cover_image && (
              <img src={previewPost.cover_image} alt={previewPost.title} className="w-full h-56 object-cover rounded-t-2xl" />
            )}
            <div className="p-6">
              <h2 className="font-serif text-2xl font-bold text-dark mb-2">{previewPost.title}</h2>
              <p className="text-xs text-muted mb-4">
                {new Date(previewPost.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {previewPost.excerpt && (
                <p className="text-sm font-semibold text-dark/70 border-l-4 border-primary pl-3 mb-4 italic">{previewPost.excerpt}</p>
              )}
              <div className="prose prose-sm max-w-none text-dark/80 whitespace-pre-wrap leading-relaxed">
                {previewPost.content}
              </div>
              {previewPost.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-base-200">
                  {previewPost.tags.map((tag, i) => (
                    <span key={i} className="badge bg-base-200 border-none text-dark">{tag}</span>
                  ))}
                </div>
              )}
              <button
                onClick={() => setPreviewPost(null)}
                className="btn btn-sm btn-ghost mt-4"
              >✕ Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogTab