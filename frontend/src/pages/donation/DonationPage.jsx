import { useState, useEffect } from 'react'
import { donationsAPI } from '../../api'
import { Link, useOutletContext } from 'react-router-dom'

const PRESETS = [100, 250, 500, 1000]
const LOGO = '/LOGO1.png'

const DEMO_RECENT = [
  { donor_name: 'Farhan A.', pet_name: 'Biscuit', amount: 500 },
  { donor_name: 'Nusrat J.', pet_name: 'General Fund', amount: 1000 },
  { donor_name: 'Sadia R.', pet_name: 'Rocky', amount: 750 },
  { donor_name: 'Karim B.', pet_name: 'Mimi', amount: 250 },
]

const GENERAL = {
  _id: 'general',
  name: 'General Fund',
  species: 'All Animals',
  emoji: '🐾',
  description: 'Support all animals in our shelter equally.',
}

export default function DonationPage() {
  const context = useOutletContext()
  const showToast = context?.showToast
  const [pets, setPets] = useState([])
  const [recent, setRecent] = useState(DEMO_RECENT)
  const [selectedPet, setSelected] = useState(null)
  const [activeAmt, setActiveAmt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: '', message: '' })

  
  const [stats, setStats] = useState({
    donors: 0,
    raised: 0,
    rescued: 0
  })


  useEffect(() => {
    donationsAPI.getPets()
      .then(res => {
        const petsData = Array.isArray(res.data) ? res.data : []
        setPets([GENERAL, ...petsData])
      })
      .catch(() => setPets([GENERAL]))

    donationsAPI.recent()
      .then(res => setRecent(Array.isArray(res.data) ? res.data.slice(0, 6) : []))
      .catch(() => {})
  }, [])

 useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/stats`)
    .then(res => res.json())
    .then(data => {
      console.log("STATS RESPONSE:", data)
      setStats(data)
    })
}, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const pickAmount = (amt) => {
    setActiveAmt(amt)
    set('amount', String(amt))
  }

  const isSelected = (pet) => {
    if (!selectedPet) return false
    if (selectedPet._id === 'general' && pet._id === 'general') return true
    return selectedPet._id === pet._id
  }

  const pct = (p) => (
    p.goal_amount
      ? Math.min(100, Math.round(((p.raised_amount || 0) / p.goal_amount) * 100))
      : null
  )

  const submit = async () => {
    const { name, email, phone, amount } = form
    if (!name || !email || !phone || !amount) {
      showToast('Please fill in all required fields', true)
      return
    }
    if (Number(amount) < 10) {
      showToast('Minimum donation is ৳10', true)
      return
    }

    try {
      setLoading(true)
      const isGeneral = !selectedPet || selectedPet._id === 'general'
      const payload = {
        donor_name: name,
        donor_email: email,
        donor_phone: phone,
        amount: Number(amount),
        message: form.message,
        pet_id: isGeneral ? null : selectedPet._id,
        is_general: isGeneral,
      }
      const res = await donationsAPI.initiate(payload)
      window.location.href = res.data.payment_url
    } catch (err) {
      showToast(err.response?.data?.message || 'Payment initiation failed', true)
      setLoading(false)
    }
  }

  const inputCls = 'w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-gray-300'
  const labelCls = 'block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5'

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-primary px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <img src={LOGO} alt="HappyPaws" className="h-12 w-auto object-contain" />
          </Link>
          
        </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white">
            <Link to="/" className="hover:text-dark transition-colors">Home</Link>
            <Link to="/pets" className="hover:text-dark transition-colors">Our Pets</Link>
            <Link to="/volunteer" className="hover:text-dark transition-colors">Volunteer</Link>            
          </div>
      </header>

      <div className="bg-gradient-to-br from-primary to-dark px-6 py-14 text-center">
        <p className="inline-block bg-accent/20 text-accent text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">Every taka makes a difference</p>
        <h2 className="font-serif text-4xl md:text-5xl text-white mb-3">Give Love,<br /><em className="text-secondary not-italic">Save a Life</em></h2>
        <p className="text-white/60 text-base max-w-md mx-auto">Your donation goes directly to food, medical care, and shelter for animals in Bangladesh.</p>
        <div className="flex justify-center gap-6 mt-8 flex-wrap">
  {[
    [stats.donors, 'Donors'],
    [
  `৳${stats.raised >= 1000
    ? (stats.raised / 1000).toFixed(1) + 'k'
    : stats.raised}`,
  'Raised'
],
    [stats.rescued, 'Pets']
  ].map(([n, l]) => (
    <div key={l} className="text-center">
      <div className="font-serif text-2xl text-accent font-bold">{n}</div>
      <div className="text-white/50 text-xs mt-0.5">{l}</div>
    </div>
  ))}
</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-start">
        <div className="fade-up">
          <h3 className="font-serif text-2xl mb-1">Choose who to support</h3>
          <p className="text-muted text-sm mb-5">Pick a specific animal or donate to the general fund.</p>

          {pets.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 animate-pulse h-20 mb-8" />
          ) : (
            <div className="mb-8 relative">
              <p className="text-sm text-muted mb-2">Choose who to support</p>

              <button
                type="button"
                onClick={() => setDropdownOpen(open => !open)}
                className={`w-full flex items-center gap-3 px-4 py-3 bg-white border rounded-xl cursor-pointer transition-all text-left ${dropdownOpen ? 'border-secondary' : 'border-gray-200'}`}
              >
                <span className="text-2xl">{selectedPet?.emoji || '🐾'}</span>
                <span className="text-sm font-medium text-dark">
                  {selectedPet?.name || 'Select an animal or fund'}
                </span>
                <span className="ml-auto text-muted text-xs">{dropdownOpen ? '▲' : '▼'}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-xl overflow-hidden shadow-sm max-h-72 overflow-y-auto">
                  {pets.map(pet => (
                    <button
                      type="button"
                      key={pet._id}
                      onClick={() => {
                        setSelected(pet)
                        setDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer border-b border-gray-100 hover:bg-light transition-colors ${isSelected(pet) ? 'bg-light' : ''}`}
                    >
                      <span className="text-2xl">{pet.emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-dark">{pet.name}</div>
                        <div className="text-xs text-muted">
                          {pet.species}
                          {pet.goal_amount ? ` · ৳${pet.goal_amount.toLocaleString()} goal` : ''}
                        </div>
                        {pct(pet) !== null && (
                          <>
                            <div className="bg-gray-100 rounded-full h-1 mt-1 overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full"
                                style={{ width: `${pct(pet)}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted mt-0.5">{pct(pet)}% raised</div>
                          </>
                        )}
                      </div>
                      {isSelected(pet) && <span className="text-secondary text-sm">✓</span>}
                    </button>
                  ))}
                </div>
              )}

              {selectedPet && (
                <div className="mt-3 p-4 bg-light rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm text-dark">{selectedPet.name}</p>
                      <p className="text-xs text-muted">{selectedPet.species}</p>
                    </div>
                    <span className="text-3xl">{selectedPet.emoji}</span>
                  </div>
                  {selectedPet.goal_amount && (
                    <div className="mt-3">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full"
                          style={{ width: `${pct(selectedPet)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted mt-1">
                        <span>৳{selectedPet.raised_amount?.toLocaleString() || 0} raised</span>
                        <span>{pct(selectedPet)}% of ৳{selectedPet.goal_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
            <h3 className="font-serif text-xl mb-5">{selectedPet ? `Donating for ${selectedPet.name}` : 'Donation Details'}</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. Rahim Uddin" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone <span className="text-red-400">*</span></label>
                <input type="text" placeholder="01XXXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Donation Amount (BDT) <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESETS.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => pickAmount(amt)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${activeAmt === amt ? 'bg-primary text-white border-primary' : 'bg-white text-dark border-gray-200 hover:border-secondary'}`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
                <input type="number" placeholder="Or enter custom amount" value={form.amount} onChange={e => { set('amount', e.target.value); setActiveAmt(null) }} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Message <span className="text-gray-300">(optional)</span></label>
                <textarea rows={3} placeholder="A kind word..." value={form.message} onChange={e => set('message', e.target.value)} className={`${inputCls} resize-none`} />
              </div>
            </div>

            {form.amount && Number(form.amount) >= 10 && (
              <div className="mt-5 bg-light rounded-2xl px-5 py-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted">Donating to</p>
                  <p className="font-semibold text-dark text-sm">{selectedPet?.name || 'General Fund'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Amount</p>
                  <p className="font-serif text-2xl text-primary font-bold">৳{Number(form.amount).toLocaleString()}</p>
                </div>
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="mt-5 w-full bg-primary text-white py-4 rounded-2xl font-semibold text-base hover:bg-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><span className="animate-spin">⏳</span> Redirecting...</> : <><span>🔒</span> Pay via SSLCommerz</>}
            </button>
            <p className="text-center text-xs text-muted mt-3">100% secure · Powered by SSLCommerz · Your info is never stored unsafely</p>
          </div>
        </div>

        <div className="fade-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-serif text-2xl mb-1">Recent Donations</h3>
          <p className="text-muted text-sm mb-5">See the kindness pouring in.</p>
          <div className="space-y-3">
            {recent.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-xl shrink-0">🐾</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-dark">{d.donor_name}</p>
                  <p className="text-xs text-muted">for {d.pet_name}</p>
                </div>
                <span className="font-serif text-lg text-primary font-bold">৳{d.amount?.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-100">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Why donate with us</p>
            <div className="space-y-3">
              {[
                ['🔒', 'SSL Encrypted', 'All payments are 256-bit encrypted'],
                ['🏦', 'SSLCommerz', "Bangladesh's most trusted payment gateway"],
                ['🐾', '100% to Animals', 'Every taka goes directly to animal care'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-dark">{title}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white/40 text-center py-6 text-xs">
        © 2026 HappyPaws Bangladesh · Powered by SSLCommerz · Made with 🐾 for animals
      </footer>
    </div>
  )
}
