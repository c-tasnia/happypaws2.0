const VolunteersTab = ({ volunteers, updateVolunteerStatus }) => {
  return (
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
  )
}

export default VolunteersTab
