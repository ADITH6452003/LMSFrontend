import React from 'react';

const RequestDetails = ({ request, navigate }) => {
  if (!request) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>No Request Selected</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Please select a request from the Approvals list.</p>
        <button className="btn btn-primary" onClick={() => navigate('/approvals')}>Back to Approvals</button>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
      <button 
        className="btn btn-outline" 
        onClick={() => navigate('/approvals')}
        style={{ marginBottom: '1.5rem', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}
      >
        ← Back to Pending List
      </button>

      <div className="card" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Review Leave Request</h1>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {request.name}
              <span className="badge badge-primary">{request.role}</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Department: {request.dept}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="badge badge-warning" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Pending Action</div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Balance remaining: <strong style={{color: 'var(--color-success)', fontSize: '1.1rem'}}>{request.available} days</strong></p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)'}}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>Type of Leave</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{request.type}</p>
          </div>
          <div style={{ background: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)'}}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>Duration</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{request.days} Day(s)</p>
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '1rem', letterSpacing: '1px' }}>Reason / Explanation provided</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', lineHeight: '1.7', fontStyle: 'italic', paddingLeft: '1rem', borderLeft: '4px solid var(--color-primary-300)' }}>
            "{request.reason || 'No specific description provided by the user.'}"
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--color-success), #059669)', flex: 1, fontSize: '1.1rem', padding: '1rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }} onClick={() => {
            alert('Leave Approved!');
            navigate('/approvals');
          }}>
            ✅ Formally Approve
          </button>
          <button className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', flex: 1, fontSize: '1.1rem', padding: '1rem' }} onClick={() => {
            alert('Leave Rejected.');
            navigate('/approvals');
          }}>
            ❌ Reject Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
