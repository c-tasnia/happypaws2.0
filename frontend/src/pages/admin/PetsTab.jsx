import { useState } from 'react'
import api from '../../api'

const emptyForm = {
  name: '', species: '', breed: '', age: '',
  description: '', image_url: '', images: [], emoji: '🐾', goal_amount: ''
}

const PetsTab = ({ pets, fetchPets, getToken, showToast }) => {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (!data.secure_url) { showToast('Image upload failed — check Cloudinary config', true); return }
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
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        )
        const data = await res.json()
        return data.secure_url
      }))
      const validUrls = urls.filter(url => typeof url === 'string' && url.startsWith('http'))
      if (!validUrls.length) { showToast('Image upload failed — check Cloudinary config', true); return }
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

  return (
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

              {/* Description */}
              <div className="form-control sm:col-span-2 lg:col-span-3">
                <label className="label text-xs font-semibold text-dark">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="textarea textarea-bordered focus:outline-primary w-full"
                  rows={3}
                />
              </div>

              {/* Cover image */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-dark">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered file-input-sm w-full" />
                {form.image_url && typeof form.image_url === 'string' && form.image_url.startsWith('http') && (
                  <div className="mt-2">
                    <img src={form.image_url} alt="Preview" className="h-24 w-full object-cover rounded-lg" />
                    <p className="text-xs text-muted mt-1 truncate">{form.image_url}</p>
                  </div>
                )}
              </div>

              {/* Multiple images */}
              <div className="form-control sm:col-span-2 lg:col-span-3">
                <label className="label text-xs font-semibold text-dark">Additional Images</label>
                <input
                  type="file" accept="image/*" multiple
                  onChange={handleMultiImageUpload}
                  className="file-input file-input-bordered file-input-sm w-full"
                  disabled={uploadingImages}
                />
                {uploadingImages && <p className="text-xs text-primary mt-1">Uploading...</p>}
                {form.images?.filter(url => typeof url === 'string' && url.startsWith('http')).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.filter(url => typeof url === 'string' && url.startsWith('http')).map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt={`preview-${i}`} className="h-20 w-20 object-cover rounded-lg"
                          onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        <button type="button"
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
  )
}

export default PetsTab
