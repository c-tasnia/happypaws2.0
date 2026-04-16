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

  // ─────────────────────────────
  // ✅ FETCH BLOGS (ADMIN ROUTE FIXED)
  // ─────────────────────────────
  const fetchBlogs = async () => {
    try {
      const token = await getToken()

      const res = await api.get('/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      })

      setBlogs(Array.isArray(res.data) ? res.data : [])
    } catch {
      showToast('Failed to load blogs', true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  // ─────────────────────────────
  // COVER UPLOAD (UNCHANGED)
  // ─────────────────────────────
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingCover(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    )

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        { method: 'POST', body: formData }
      )

      const data = await res.json()

      if (!data.secure_url) {
        showToast('Cover upload failed', true)
        return
      }

      setForm((f) => ({ ...f, cover_image: data.secure_url }))
      showToast('Cover image uploaded! ✅')
    } catch {
      showToast('Cover upload failed', true)
    } finally {
      setUploadingCover(false)
    }
  }

  // ─────────────────────────────
  // CREATE / UPDATE BLOG (FIXED ROUTES)
  // ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = await getToken()

      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      }

      const res = editingId
        ? await api.put(`/admin/blogs/${editingId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await api.post('/admin/blogs', payload, {
            headers: { Authorization: `Bearer ${token}` },
          })

      if (res.status === 200 || res.status === 201) {
        showToast(editingId ? 'Blog updated! ✍️' : 'Blog published! 🎉')
        setForm(emptyForm)
        setEditingId(null)
        setShowForm(false)
        fetchBlogs()
      } else {
        showToast('Something went wrong', true)
      }
    } catch (err) {
      console.error(err)
      showToast('Something went wrong', true)
    }
  }

  // ─────────────────────────────
  // EDIT
  // ─────────────────────────────
  const handleEdit = (blog) => {
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      cover_image: blog.cover_image || '',
      tags: Array.isArray(blog.tags)
        ? blog.tags.join(', ')
        : blog.tags || '',
      published: blog.published ?? true,
    })

    setEditingId(blog._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─────────────────────────────
  // DELETE (FIXED ROUTE)
  // ─────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return

    const token = await getToken()

    await api.delete(`/admin/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    showToast('Blog deleted')
    fetchBlogs()
  }

  // ─────────────────────────────
  // TOGGLE PUBLISH (FIXED ROUTE)
  // ─────────────────────────────
  const handleTogglePublish = async (blog) => {
    const token = await getToken()

    await api.patch(
      `/admin/blogs/${blog._id}`,
      { published: !blog.published },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    showToast(blog.published ? 'Blog unpublished' : 'Blog published! 🎉')
    fetchBlogs()
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    )

  return (
    <div>
      {/* KEEP YOUR UI EXACTLY SAME BELOW */}
      {/* (no UI changes needed, only API fixed) */}
    </div>
  )
}

export default BlogTab