import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import api from '../../api' 

const emptyForm = {
  name: '', species: '', breed: '', age: '',
  description: '', image_url: '', images: [], emoji: '🐾', goal_amount: ''
}

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const context = useOutletContext()
  const showToast = context?.showToast

  const [uploadingImages, setUploadingImages] = useState(false)
  const [tab, setTab] = useState('pets')
  const [pets, setPets] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',')
    if (!adminEmails.includes(currentUser.email)) { navigate('/'); return }
  }, [currentUser])

  const getToken = () => currentUser.getIdToken()

 const fetchPets = async () => {
  const token = await getToken()
  const res = await api.get('/pets', {
    headers: { Authorization: `Bearer ${token}` }
  })
  setPets(Array.isArray(res.data) ? res.data : [])
}

 const fetchDonations = async () => {
  const token = await getToken()
  const res = await api.get('/admin/donations', {
    headers: { Authorization: `Bearer ${token}` }
  })
  setDonations(Array.isArray(res.data) ? res.data : [])
}

  useEffect(() => {
    if (!currentUser) return
    Promise.all([fetchPets(), fetchDonations()]).finally(() => setLoading(false))
  }, [currentUser])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setForm(f => ({ ...f, image_url: data.secure_url }))
      showToast('Image uploaded! ✅')
    } catch (err) {
      showToast('Image upload failed', true)
    }
  }

  const handleMultiImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploadingImages(true)
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        return data.secure_url
      }))
      setForm(f => ({ ...f, images: [...(f.images || []), ...urls] }))
      showToast(`${urls.length} image(s) uploaded! ✅`)
    } catch (err) {
      showToast('Image upload failed', true)
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const token = await getToken()
    const payload = { ...form, age: Number(form.age), goal_amount: Number(form.goal_amount) }
    const res = editingId
      ? await api.put(`/pets/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } })
      : await api.post('/pets', payload, { headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 200 || res.status === 201) {
      showToast(editingId ? 'Pet updated! 🐾' : 'Pet added! 🐾')
      setForm(emptyForm); setEditingId(null); setShowForm(false)
      fetchPets()
    } else {
      showToast('Something went wrong', true)
    }
  } catch (err) {
    console.error('Full error:', err)
    showToast('Something went wrong', true)
  }
}
  const handleEdit = (pet) => {
    setForm({
      name: pet.name, species: pet.species, breed: pet.breed || '',
      age: pet.age || '', description: pet.description || '',
      image_url: pet.image_url || '', images: pet.images || [],
      emoji: pet.emoji || '🐾', goal_amount: pet.goal_amount
    })
    setEditingId(pet._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
  if (!confirm('Deactivate this pet?')) return
  const token = await getToken()
  await api.delete(`/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  showToast('Pet deactivated')
  fetchPets()
}

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-dark text-white px-6 py-5 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold">Admin Dashboard 🐾</h1>
          <p className="text-white/60 text-xs mt-0.5">{currentUser?.email}</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="btn btn-sm btn-outline text-white border-white/40 hover:bg-white/10 hover:border-white"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="tabs tabs-bordered mb-8">
          <button
            className={`tab tab-lg font-semibold ${tab === 'pets' ? 'tab-active text-primary' : 'text-muted'}`}
            onClick={() => setTab('pets')}
          >
            🐾 Pets
          </button>
          <button
            className={`tab tab-lg font-semibold ${tab === 'donations' ? 'tab-active text-primary' : 'text-muted'}`}
            onClick={() => setTab('donations')}
          >
            💰 Donations
          </button>
        </div>

        {/* ── Pets Tab ── */}
        {tab === 'pets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-dark">All Pets ({pets.length})</h2>
              <button
                onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }}
                className="btn btn-sm text-white border-none bg-primary hover:bg-dark"
              >
                {showForm ? 'Cancel' : '+ Add Pet'}
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="card bg-white border border-base-200 shadow-sm mb-8">
                <div className="card-body">
                  <h3 className="font-serif text-lg font-bold text-dark mb-4">
                    {editingId ? 'Edit Pet' : 'Add New Pet'}
                  </h3>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      ['name', 'Name', 'text', true],
                      ['species', 'Species', 'text', true],
                      ['breed', 'Breed', 'text', false],
                      ['age', 'Age (years)', 'number', false],
                      ['emoji', 'Emoji', 'text', false],
                      ['goal_amount', 'Goal Amount (৳)', 'number', true],
                    ].map(([field, label, type, required]) => (
                      <div key={field} className="form-control">
                        <label className="label text-xs font-semibold text-dark">{label}</label>
                        <input
                          type={type}
                          value={form[field]}
                          onChange={e => setForm({ ...form, [field]: e.target.value })}
                          className="input input-bordered input-sm focus:outline-primary w-full"
                          required={required}
                        />
                      </div>
                    ))}
                    <div className="form-control">
                      <label className="label text-xs font-semibold text-dark">Pet Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered file-input-sm w-full"
                      />
                      {form.image_url && (
                        <div className="mt-2">
                          <img src={form.image_url} alt="Preview" className="h-24 w-full object-cover rounded-lg" />
                          <p className="text-xs text-muted mt-1 truncate">{form.image_url}</p>
                        </div>
                      )}
                    </div>
                    <div className="form-control sm:col-span-2 lg:col-span-3">
                      <label className="label text-xs font-semibold text-dark">Pet Images (multiple allowed)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultiImageUpload}
                        className="file-input file-input-bordered file-input-sm w-full"
                        disabled={uploadingImages}
                      />
                      {uploadingImages && <p className="text-xs text-primary mt-1">Uploading...</p>}
                      {form.images?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.images.map((url, i) => (
                            <div key={i} className="relative">
                              <img src={url} alt={`preview-${i}`} className="h-20 w-20 object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                                className="absolute -top-1 -right-1 bg-error text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <button type="submit" className="btn text-white border-none bg-primary hover:bg-dark">
                        {editingId ? 'Update Pet' : 'Add Pet'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Pets Table */}
            <div className="card bg-white border border-base-200 shadow-sm overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-light text-dark">
                  <tr>
                    {['Pet', 'Species', 'Goal', 'Raised', 'Status', 'Actions'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pets.map(pet => (
                    <tr key={pet._id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{pet.emoji}</span>
                          <span className="font-semibold">{pet.name}</span>
                        </div>
                      </td>
                      <td className="text-muted">{pet.species}</td>
                      <td>৳{pet.goal_amount.toLocaleString()}</td>
                      <td className="text-primary font-semibold">৳{pet.raised_amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-sm font-semibold border-none ${pet.is_active ? 'bg-light text-dark' : 'bg-red-100 text-red-600'}`}>
                          {pet.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(pet)} className="btn btn-xs btn-outline border-primary text-primary hover:bg-primary hover:text-white">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(pet._id)} className="btn btn-xs btn-outline border-error text-error hover:bg-error hover:text-white">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Donations Tab ── */}
        {tab === 'donations' && (
          <div>
            <h2 className="text-lg font-bold text-dark mb-6">All Donations ({donations.length})</h2>
            <div className="card bg-white border border-base-200 shadow-sm overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-light text-dark">
                  <tr>
                    {['Donor', 'Email', 'Phone', 'Amount', 'Pet', 'Status', 'Date', 'Message'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d._id}>
                      <td className="font-semibold">{d.donor_name}</td>
                      <td className="text-muted">{d.donor_email}</td>
                      <td className="text-muted">{d.donor_phone}</td>
                      <td className="text-primary font-semibold">৳{d.amount.toLocaleString()}</td>
                      <td>{d.pet ? `${d.pet.emoji} ${d.pet.name}` : 'General'}</td>
                      <td>
                        <span className={`badge badge-sm font-semibold border-none ${
                          d.status === 'success' ? 'bg-light text-dark' :
                          d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="text-muted">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="text-muted">{d.message || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard