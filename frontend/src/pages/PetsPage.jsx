import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const PetsPage = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState(null)
  const [activePhoto, setActivePhoto] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/pets`)
      .then(r => r.json())
      .then(data => { setPets(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const openModal = (pet) => {
    setSelectedPet(pet)
    setActivePhoto(0)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedPet(null)
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const openLightbox = (e) => {
    e.stopPropagation()
    setLightboxOpen(true)
  }

  const closeLightbox = (e) => {
    e.stopPropagation()
    setLightboxOpen(false)
  }

  const allPhotos = (pet) => {
    const photos = []
    if (pet.image_url) photos.push(pet.image_url)
    if (pet.images?.length) photos.push(...pet.images.filter(u => u !== pet.image_url))
    return photos
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-dark text-white py-16 px-4 text-center">
        <p className="text-xs tracking-widest uppercase text-secondary mb-2">Our Animals</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Meet the Pets</h1>
        <p className="text-white/70 max-w-md mx-auto text-sm leading-relaxed">
          Each of these animals needs your support. Your donation goes directly to their care.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {pets.length === 0 ? (
          <p className="text-center text-muted">No pets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => {
              const progress = Math.min((pet.raised_amount / pet.goal_amount) * 100, 100)
              const photos = allPhotos(pet)
              return (
                <div
                  key={pet._id}
                  onClick={() => openModal(pet)}
                  className="card bg-white shadow-sm border border-base-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                >
                  {photos.length > 0 ? (
                    <figure className="h-48 overflow-hidden">
                      <img src={photos[0]} alt={pet.name} className="w-full h-full object-cover" />
                    </figure>
                  ) : (
                    <div className="h-48 bg-light flex items-center justify-center text-6xl">
                      {pet.emoji}
                    </div>
                  )}
                  <div className="card-body p-5">
                    <div className="flex justify-between items-center">
                      <h2 className="card-title font-serif text-dark">{pet.name}</h2>
                      <span className="badge badge-sm bg-light text-dark border-none font-semibold">
                        {pet.species}
                      </span>
                    </div>
                    {pet.breed && (
                      <p className="text-xs text-muted -mt-1">
                        {pet.breed} • {pet.age} yr{pet.age !== 1 ? 's' : ''}
                      </p>
                    )}
                    <p className="text-sm text-muted leading-relaxed line-clamp-2">
                      {pet.description}
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-primary font-semibold">৳{pet.raised_amount.toLocaleString()} raised</span>
                        <span className="text-muted">of ৳{pet.goal_amount.toLocaleString()}</span>
                      </div>
                      <progress className="progress progress-success w-full h-2" value={progress} max="100" />
                    </div>
                    {photos.length > 1 && (
                      <p className="text-xs text-muted mt-1">📷 {photos.length} photos</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Pet Modal ── */}
      {selectedPet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Photo Gallery */}
            {allPhotos(selectedPet).length > 0 ? (
              <div className="relative">
                {/* Clickable main image → opens lightbox */}
                <div className="relative cursor-zoom-in group" onClick={openLightbox}>
                  <img
                    src={allPhotos(selectedPet)[activePhoto]}
                    alt={selectedPet.name}
                    className="w-full h-72 object-cover rounded-t-2xl"
                  />
                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-t-2xl flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                      
                    </span>
                  </div>
                </div>

                {allPhotos(selectedPet).length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhoto(p => (p - 1 + allPhotos(selectedPet).length) % allPhotos(selectedPet).length)}
                      className="absolute left-3 top-36 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
                    >‹</button>
                    <button
                      onClick={() => setActivePhoto(p => (p + 1) % allPhotos(selectedPet).length)}
                      className="absolute right-3 top-36 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
                    >›</button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      {allPhotos(selectedPet).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhoto(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === activePhoto ? 'bg-white scale-125' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Thumbnail strip */}
                {allPhotos(selectedPet).length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                    {allPhotos(selectedPet).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`thumb-${i}`}
                        onClick={() => setActivePhoto(i)}
                        className={`h-14 w-14 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${i === activePhoto ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 bg-light flex items-center justify-center text-7xl rounded-t-2xl">
                {selectedPet.emoji}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-dark">{selectedPet.name}</h2>
                  {selectedPet.breed && (
                    <p className="text-sm text-muted">{selectedPet.breed} • {selectedPet.age} yr{selectedPet.age !== 1 ? 's' : ''}</p>
                  )}
                </div>
                <span className="badge bg-light text-dark border-none font-semibold">{selectedPet.species}</span>
              </div>

              <p className="text-sm text-muted leading-relaxed mb-5">{selectedPet.description}</p>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-primary font-semibold">৳{selectedPet.raised_amount.toLocaleString()} raised</span>
                  <span className="text-muted">of ৳{selectedPet.goal_amount.toLocaleString()}</span>
                </div>
                <progress
                  className="progress progress-success w-full"
                  value={Math.min((selectedPet.raised_amount / selectedPet.goal_amount) * 100, 100)}
                  max="100"
                />
              </div>

              <div className="flex gap-3">
                <Link
                  to="/donations"
                  onClick={closeModal}
                  className="btn flex-1 text-white border-none bg-primary hover:bg-dark"
                >
                  Donate for {selectedPet.name}
                </Link>
                <button onClick={closeModal} className="btn btn-outline border-base-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && selectedPet && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl z-10"
          >✕</button>

          {/* Prev / Next */}
          {allPhotos(selectedPet).length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActivePhoto(p => (p - 1 + allPhotos(selectedPet).length) % allPhotos(selectedPet).length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl z-10"
              >‹</button>
              <button
                onClick={(e) => { e.stopPropagation(); setActivePhoto(p => (p + 1) % allPhotos(selectedPet).length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl z-10"
              >›</button>
            </>
          )}

          {/* Full image */}
          <img
            src={allPhotos(selectedPet)[activePhoto]}
            alt={selectedPet.name}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Counter */}
          {allPhotos(selectedPet).length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {activePhoto + 1} / {allPhotos(selectedPet).length}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default PetsPage