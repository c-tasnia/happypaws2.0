import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'

const emptyForm = {
  name: '', species: '', breed: '', age: '',
  description: '', image_url: '', images: [], emoji: '🐾', goal_amount: ''
}
const LOGO = '/LOGO1.png'

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const context = useOutletContext()
  const showToast = context?.showToast

  const [uploadingImages, setUploadingImages] = useState(false)
  const [tab, setTab] = useState('pets')
  const [pets, setPets] = useState([])
  const [donations, setDonations] = useState([])
  const [volunteers, setVolunteers] = useState([])
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
    const res = await api.get('/pets', { headers: { Authorization: `Bearer ${token}` } })
    setPets(Array.isArray(res.data) ? res.data : [])
  }

  const fetchDonations = async () => {
    const token = await getToken()
    const res = await api.get('/admin/donations', { headers: { Authorization: `Bearer ${token}` } })
    setDonations(Array.isArray(res.data) ? res.data : [])
  }

  const fetchVolunteers = async () => {
    const token = await getToken()
    const res = await api.get('/volunteer', { headers: { Authorization: `Bearer ${token}` } })
    setVolunteers(Array.isArray(res.data) ? res.data : [])
  }

  const updateVolunteerStatus = async (id, status) => {
    const token = await getToken()
    await api.patch(`/volunteer/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
    showToast(`Application ${status}`)
    fetchVolunteers()
  }

  useEffect(() => {
    if (!currentUser) return
    Promise.all([fetchPets(), fetchDonations(), fetchVolunteers()]).finally(() => setLoading(false))
  }, [currentUser])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      console.log('Cloudinary single image response:', data)
      if (!data.secure_url) {
        showToast('Image upload failed — check Cloudinary config', true)
        return
      }
      setForm(f => ({ ...f, image_url: data.secure_url }))
      showToast('Image uploaded! ✅')
    } catch {
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
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
        const data = await res.json()
        console.log('Cloudinary multi image response:', data)
        return data.secure_url
      }))

      // ✅ Filter out any undefined/null/non-http values
      const validUrls = urls.filter(url => typeof url === 'string' && url.startsWith('http'))

      if (validUrls.length === 0) {
        showToast('Image upload failed — check Cloudinary config', true)
        return
      }

      setForm(f => ({ ...f, images: [...(f.images || []), ...validUrls] }))
      showToast(`${validUrls.length} image(s) uploaded! ✅`)
    } catch {
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
      console.error(err)
      showToast('Something went wrong', true)
    }
  }

  const handleEdit = (pet) => {
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age || '',
      description: pet.description || '',
      image_url: pet.image_url || '',
      // ✅ Filter out invalid URLs when loading existing pet data
      images: (pet.images || []).filter(url => typeof url === 'string' && url.startsWith('http')),
      emoji: pet.emoji || '🐾',
      goal_amount: pet.goal_amount
    })
    setEditingId(pet._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this pet?')) return
    const token = await getToken()
    await api.delete(`/pets/${id}`, { headers: { Authorization: `Bearer ${token}` } })
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
      <div className="bg-dark text-white px-6 py-2 flex justify-between items-center">
        <div className="bg-dark text-white px-6 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={LOGO} alt="HappyPaws" className="h-10 w-auto object-contain" />
          </Link>
          <h1 className="font-serif text-1xl font-bold px-4">Admin Dashboard</h1>
          <p className="text-white/60 text-xs mt-0.5">{currentUser?.email}</p>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white">
          <Link to="/admin" className="text-primary font-semibold">Admin</Link>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="px-4 py-2 rounded-full bg-primary text-white hover:bg-dark transition-colors"
          >
            Logout
          </button>
        </div>
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
          <button
            className={`tab tab-lg font-semibold ${tab === 'volunteers' ? 'tab-active text-primary' : 'text-muted'}`}
            onClick={() => setTab('volunteers')}
          >
            🙋 Volunteers ({volunteers.length})
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

                    {/* Single cover image */}
                    <div className="form-control">
                      <label className="label text-xs font-semibold text-dark">Pet Image</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered file-input-sm w-full" />
                      {form.image_url && typeof form.image_url === 'string' && form.image_url.startsWith('http') ? (
                        <div className="mt-2">
                          <img src={form.image_url} alt="Preview" className="h-24 w-full object-cover rounded-lg" />
                          <p className="text-xs text-muted mt-1 truncate">{form.image_url}</p>
                        </div>
                      ) : null}
                    </div>

                    {/* Multiple images */}
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

                      {/* ✅ Only render previews for valid URLs */}
                      {form.images?.filter(url => typeof url === 'string' && url.startsWith('http')).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.images
                            .filter(url => typeof url === 'string' && url.startsWith('http'))
                            .map((url, i) => (
                              <div key={i} className="relative">
                                <img
                                  src={url}
                                  alt={`preview-${i}`}
                                  className="h-20 w-20 object-cover rounded-lg"
                                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setForm(f => ({
                                    ...f,
                                    images: f.images.filter((_, idx) => idx !== i)
                                  }))}
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

            <div className="card bg-white border border-base-200 shadow-sm overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-light text-dark">
                  <tr>{['Pet', 'Species', 'Goal', 'Raised', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {pets.map(pet => (
                    <tr key={pet._id}>
                      <td><div className="flex items-center gap-2"><span className="text-2xl">{pet.emoji}</span><span className="font-semibold">{pet.name}</span></div></td>
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
                          <button onClick={() => handleEdit(pet)} className="btn btn-xs btn-outline border-primary text-primary hover:bg-primary hover:text-white">Edit</button>
                          <button onClick={() => handleDelete(pet._id)} className="btn btn-xs btn-outline border-error text-error hover:bg-error hover:text-white">Delete</button>
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
                  <tr>{['Donor', 'Email', 'Phone', 'Amount', 'Pet', 'Status', 'Date', 'Message'].map(h => <th key={h}>{h}</th>)}</tr>
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
                        }`}>{d.status}</span>
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

        {/* ── Volunteers Tab ── */}
        {tab === 'volunteers' && (
          <div>
            <h2 className="text-lg font-bold text-dark mb-6">Volunteer Applications ({volunteers.length})</h2>
            <div className="card bg-white border border-base-200 shadow-sm overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-light text-dark">
                  <tr>{['Name', 'Email', 'Phone', 'Interest', 'Availability', 'Message', 'Date', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {volunteers.length === 0 && (
                    <tr><td colSpan={9} className="text-center text-muted py-8">No applications yet</td></tr>
                  )}
                  {volunteers.map(v => (
                    <tr key={v._id}>
                      <td className="font-semibold">{v.fullName}</td>
                      <td className="text-muted">{v.email}</td>
                      <td className="text-muted">{v.phone}</td>
                      <td>{v.interest}</td>
                      <td>{v.availability}</td>
                      <td className="text-muted max-w-xs truncate">{v.message || '—'}</td>
                      <td className="text-muted">{new Date(v.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-sm font-semibold border-none ${
                          v.status === 'approved' ? 'bg-light text-dark' :
                          v.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{v.status}</span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {v.status !== 'approved' && (
                            <button
                              onClick={() => updateVolunteerStatus(v._id, 'approved')}
                              className="btn btn-xs btn-outline border-primary text-primary hover:bg-primary hover:text-white"
                            >Approve</button>
                          )}
                          {v.status !== 'rejected' && (
                            <button
                              onClick={() => updateVolunteerStatus(v._id, 'rejected')}
                              className="btn btn-xs btn-outline border-error text-error hover:bg-error hover:text-white"
                            >Reject</button>
                          )}
                        </div>
                      </td>
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