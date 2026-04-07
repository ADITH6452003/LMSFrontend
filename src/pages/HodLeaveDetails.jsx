import React from 'react';

const HodLeaveDetails = ({ hod, navigate }) => {
  if (!hod) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-text-main)' }}>No HOD Selected</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Please select an HOD from the Approvals list.</p>
        <button className="btn btn-primary" onClick={() => navigate('/approvals')}>Back to Approvals</button>
      </div>
    );
  }

  // Render historical leave from calculation engine
  const leaveHistory = hod.history || [];

  return (
    <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
      <button 
        className="btn btn-outline" 
        onClick={() => navigate('/approvals')}
        style={{ marginBottom: '1.5rem', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}
      >
        ← Back to Leave Approvals
      </button>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>HOD Leave Profile</h1>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {hod.name}
              <span className="badge badge-primary">{hod.dept} Department</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-warning-bg)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-warning)' }}>{hod.taken} <span style={{fontSize: '0.85rem', color: 'var(--color-warning)', fontWeight: 500}}>/ 20</span></div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Taken</div>
            </div>
            <div style={{ background: 'var(--color-success-bg)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{hod.remaining}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</div>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', marginBottom: '1rem' }}>Historical Leave Register</h3>
        
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Leave Type</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Period</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Verification</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, index) => (
                <tr key={leave.id} style={{ borderBottom: '1px solid var(--color-border)', background: index % 2 === 0 ? 'white' : 'var(--color-background)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--color-text-main)' }}>{leave.type}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{leave.from} <span style={{margin:'0 0.25rem'}}>→</span> {leave.to}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-main)', fontWeight: 600 }}>{leave.days} d</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-success">{leave.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HodLeaveDetails;
