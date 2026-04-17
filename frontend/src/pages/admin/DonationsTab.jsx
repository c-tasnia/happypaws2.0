const DonationsTab = ({ donations }) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-dark mb-6">All Donations ({donations.length})</h2>
      <div className="card bg-white border border-base-200 shadow-sm overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-light text-dark">
            <tr>{['Donor', 'Email', 'Phone', 'Amount', 'Pet', 'Status', 'Date', 'Message'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {donations.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted py-8">No donations yet</td></tr>
            )}
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
  )
}

export default DonationsTab
