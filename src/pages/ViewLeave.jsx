import React from 'react';

const ViewLeave = ({ user, navigate, pendingRequests }) => {
  // Intersect active frontend mutations into the historical array securely 
  const userPendingLeaves = pendingRequests
    .filter(req => (req.name === user?.name || req.userid === user?.userid) && req.role?.toLowerCase() === user?.role?.toLowerCase())
    .map(req => ({ ...req, status: req.status || 'Pending' }));

  // Dynamically sort array using standard Date chronologies, demanding standard latest-first (descending) priority maps
  const allLeaves = [...userPendingLeaves].sort((a, b) => {
    return new Date(b.fromDate) - new Date(a.fromDate);
  });

  return (
    <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
      <button 
        className="btn btn-outline" 
        onClick={() => navigate('/')}
        style={{ marginBottom: '1.5rem', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}
      >
        ← Back to Dashboard Dashboard
      </button>

      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', borderTop: '4px solid var(--color-primary-500)' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'var(--color-primary-700)', marginBottom: '0.25rem', fontSize: '1.5rem' }}>Personal Leave Timeline</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Review all historic tracking alongside current live actions arranged strictly by latest interactions.</p>
          </div>
        </div>

        {allLeaves.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>No recognized historic logs detected for your account mapping.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {allLeaves.map(leave => (
              <div key={leave.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white', borderLeft: leave.status === 'Approved' ? '4px solid var(--color-success)' : leave.status === 'Pending' ? '4px solid var(--color-warning)' : '4px solid var(--color-danger)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--color-border)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>{leave.type} Leave</h3>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
                      🗓 <strong style={{ color: 'var(--color-text-main)' }}>{leave.fromDate}</strong> to <strong style={{ color: 'var(--color-text-main)' }}>{leave.toDate}</strong> ({leave.days} d)
                    </span>
                  </div>
                  <div>
                    {leave.status === 'Pending' && <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>⏳ Pending</span>}
                    {leave.status === 'Approved' && <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>✅ Approved</span>}
                    {leave.status === 'Rejected' && <span className="badge" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626' }}>❌ Rejected</span>}
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem' }}>
                  <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Verification Reason Provided</h5>
                  <p style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', fontStyle: 'italic', lineHeight: '1.6' }}>"{leave.reason}"</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLeave;
