import React, { useState } from 'react';

const ManageUsers = ({ user, users, onUsersChanged, navigate }) => {
  const [formData, setFormData] = useState({ name: '', userid: '', dept: user.role === 'principal' ? '' : user.dept, password: 'password123' });

  let targetRole = '';
  let formTitle = '';
  let subordinates = [];

  if (user?.role === 'principal') {
    targetRole = 'hod';
    formTitle = 'Create Head of Department';
    subordinates = users.filter(u => u.role === 'hod');
  } else if (user?.role === 'hod') {
    targetRole = 'staff';
    formTitle = 'Create Department Staff';
    subordinates = users.filter(u => u.role === 'staff' && u.dept === user.dept);
  } else if (user?.role === 'staff') {
    targetRole = 'student';
    formTitle = 'Assign New Student';
    subordinates = users.filter(u => u.role === 'student' && u.dept === user.dept && u.assignedStaff === user.userid);
  } else {
    return (
      <div className="card">
        <h2>Unauthorized Area</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Dashboard</button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.userid || !formData.password || (!formData.dept && targetRole === 'hod')) {
      alert('Please fill in all required fields!');
      return;
    }

    const payload = {
      role: targetRole,
      name: formData.name,
      userid: formData.userid,
      dept: formData.dept,
      password: formData.password,
      assignedStaff: targetRole === 'student' ? user.userid : null,
      assignedHod: targetRole === 'staff' ? user.userid : null
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await onUsersChanged();
        setFormData({ name: '', userid: '', dept: user.role === 'principal' ? '' : user.dept, password: 'password123' });
      } else {
        alert(data.message || 'Failed to create user.');
      }
    } catch (err) {
      alert('Server unreachable. Is the backend running?');
    }
  };

  const handleDelete = async (idTarget) => {
    if (confirm('Delete this user? This action cannot be undone.')) {
      try {
        await fetch(`/api/users/${targetRole}/${idTarget}`, { method: 'DELETE' });
        await onUsersChanged();
      } catch (err) {
        alert('Server unreachable. Is the backend running?');
      }
    }
  };

  return (
    <>
      <div className="card glass-panel" style={{ borderTop: '4px solid var(--color-primary-500)', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{formTitle} Mechanism</h2>

        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Full Legal Name</label>
            <input type="text" name="name" className="input-field" value={formData.name} onChange={handleInputChange} placeholder="e.g. Adith B" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Designated User ID</label>
            <input type="text" name="userid" className="input-field" value={formData.userid} onChange={handleInputChange} placeholder="e.g. CSE004" />
          </div>

          {user?.role === 'principal' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Department Scope</label>
              <select name="dept" className="input-field" value={formData.dept} onChange={handleInputChange}>
                <option value="">Select Dept</option>
                <option value="AIML">AIML</option>
                <option value="AIDS">AIDS</option>
                <option value="CSE">CSE</option>
                <option value="CSBS">CSBS</option>
                <option value="CCS">CCS</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Default Password</label>
            <input type="text" name="password" className="input-field" value={formData.password} onChange={handleInputChange} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Deploy Profile</button>
        </form>
      </div>

      <div className="card glass-panel" style={{ borderTop: '4px solid var(--color-warning)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Supervised Hierarchy ({subordinates.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Role</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ID Vector</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Department</th>
                {targetRole === 'student' && <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Staff Supervisor</th>}
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {subordinates.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No users registered yet.</td>
                </tr>
              ) : (
                subordinates.map((sub, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)', background: idx % 2 === 0 ? 'white' : 'var(--color-primary-50)' }}>
                    <td style={{ padding: '1rem', textTransform: 'capitalize', fontWeight: '500' }}>{sub.role}</td>
                    <td style={{ padding: '1rem' }}>{sub.name}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{sub.userid}</td>
                    <td style={{ padding: '1rem' }}><span className="badge badge-success">{sub.dept}</span></td>
                    {targetRole === 'student' && <td style={{ padding: '1rem' }}><span className="badge badge-warning">{sub.assignedStaff}</span></td>}
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => handleDelete(sub.userid)} className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Purge ✕</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
