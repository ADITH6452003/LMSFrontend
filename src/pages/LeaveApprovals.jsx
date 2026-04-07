import React, { useState } from 'react';

const LeaveApprovals = ({ pendingRequests = [], allRequests = [], user, users = [], onUpdateStatus, onHodSelect }) => {
  const [expandedId, setExpandedId] = useState(null);

  // Derive metrics dynamically linking straight against Approved array items
  let staffStudents = [];
  if (user?.role === 'staff') {
    const assignedStudents = users.filter(u => u.role === 'student' && u.assignedStaff === user?.userid);
    for (const student of assignedStudents) {
        const approvedLeaves = allRequests.filter(req => req.userid === student.userid && req.role?.toLowerCase() === 'student' && req.status === 'Approved');
        const calculatedTaken = approvedLeaves.reduce((sum, req) => sum + req.days, 0);
        
        staffStudents.push({
          id: `s_${student.userid}`,
          name: student.name,
          dept: student.dept,
          taken: calculatedTaken,
          remaining: 20 - calculatedTaken
        });
    }
  }

  let departmentStaff = [];
  if (user?.role === 'hod') {
    const assignedStaff = users.filter(u => u.role === 'staff' && u.dept === user?.dept);
    for (const staff of assignedStaff) {
        const approvedLeaves = allRequests.filter(req => req.userid === staff.userid && req.role?.toLowerCase() === 'staff' && req.status === 'Approved');
        const calculatedTaken = approvedLeaves.reduce((sum, req) => sum + req.days, 0);

        departmentStaff.push({
          id: `stf_${staff.userid}`,
          name: staff.name,
          dept: staff.dept,
          taken: calculatedTaken,
          remaining: 20 - calculatedTaken
        });
    }
  }

  let principalHods = [];
  if (user?.role === 'principal') {
    const hods = users.filter(u => u.role === 'hod');
    for (const hod of hods) {
        const approvedLeaves = allRequests.filter(req => req.userid === hod.userid && req.role?.toLowerCase() === 'hod' && req.status === 'Approved');
        const calculatedTaken = approvedLeaves.reduce((sum, req) => sum + req.days, 0);
        principalHods.push({
          id: `h_${hod.userid}`,
          name: hod.name,
          dept: hod.dept,
          taken: calculatedTaken,
          remaining: 20 - calculatedTaken
        });
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-primary-700)' }}>Leave Approvals</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span className="badge badge-warning">{pendingRequests.length} Pending Approvals</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Pending Requests</h2>
        {pendingRequests.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No pending requests found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.map(req => (
              <div 
                key={req.id} 
                style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}
              >
                <button 
                  onClick={() => toggleExpand(req.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', width: '100%', background: 'transparent', textAlign: 'left', cursor: 'pointer', outline: 'none', border: 'none' }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>
                      {req.name} 
                      <span className="badge" style={{ fontSize: '0.7rem', marginLeft: '0.5rem', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)'}}>{req.role}</span>
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{req.dept} &bull; {req.days} days</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-600)', fontWeight: 500 }}>Balance: {req.available} days</p>
                    <span style={{ color: 'var(--color-primary-500)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {expandedId === req.id ? 'Hide details ▲' : 'Review details ▼'}
                    </span>
                  </div>
                </button>

                {expandedId === req.id && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-background)', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>Leave Type: {req.type}</h4>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-primary-700)', fontWeight: 700, background: 'var(--color-primary-50)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-100)', display: 'inline-flex', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                          🗓 <span style={{ marginLeft: '0.25rem' }}>{req.fromDate || 'N/A'}</span> <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.8rem', margin: '0 0.4rem' }}>to</span> <span>{req.toDate || 'N/A'}</span>
                        </span>
                      </div>
                      <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Reason / Description</h5>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', fontStyle: 'italic', lineHeight: '1.5' }}>"{req.reason}"</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={() => onUpdateStatus && onUpdateStatus(req.id, 'Rejected')}>
                        Reject Request
                      </button>
                      <button className="btn btn-primary" style={{ background: 'var(--color-success)', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.25)' }} onClick={() => onUpdateStatus && onUpdateStatus(req.id, 'Approved')}>
                        Approve Leave
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {user?.role === 'staff' && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Assigned Students Coverage Tracker</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {staffStudents.map(student => (
              <div 
                key={student.id} 
                className="glass-panel" 
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '1.5rem', borderTop: '4px solid var(--color-danger)', background: 'white', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
              >
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.1rem', color: 'var(--color-text-main)' }}>{student.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{student.dept} Tracked Capacities</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-danger)' }}>{student.taken}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Taken</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success)' }}>{student.remaining}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role === 'hod' && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Active Department Staff Statistics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {departmentStaff.map(staff => (
                <div 
                  key={staff.id} 
                  className="glass-panel" 
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '1.5rem', borderTop: '4px solid var(--color-primary-500)', background: 'white', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
                >
                  <h3 style={{ marginBottom: '0.25rem', fontSize: '1.1rem', color: 'var(--color-text-main)' }}>{staff.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{staff.dept} Operational Scope</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-warning)' }}>{staff.taken}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Taken</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success)' }}>{staff.remaining}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Department Students Leave Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {allRequests.filter(req => req.role === 'Student' && req.dept === user.dept).length === 0 ? (
                 <p style={{ color: 'var(--color-text-muted)' }}>No student leave records found for this department.</p>
              ) : (
                allRequests.filter(req => req.role === 'Student' && req.dept === user.dept)
                  .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
                  .map(req => (
                  <div key={req.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>{req.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>🗓 {req.fromDate} to {req.toDate} ({req.days} days) &bull; <strong>{req.type}</strong></p>
                    </div>
                    <div>
                      {(!req.status || req.status === 'Pending') && <span className="badge badge-warning">⏳ Pending</span>}
                      {req.status === 'Approved' && <span className="badge badge-success">✅ Approved</span>}
                      {req.status === 'Rejected' && <span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>❌ Rejected</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {user?.role === 'principal' && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Global Department HODs Oversight</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {principalHods.map(hod => (
              <div 
                key={hod.id} 
                className="glass-panel" 
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '1.5rem', borderTop: '4px solid #8b5cf6', background: 'white', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
              >
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.1rem', color: 'var(--color-text-main)' }}>{hod.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Department Chief</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#8b5cf6' }}>{hod.taken}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Taken</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success)' }}>{hod.remaining}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;
