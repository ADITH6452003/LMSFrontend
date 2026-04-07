import React, { useState, useEffect } from 'react';

const ApplyLeave = ({ navigate, user, onRequestSubmitted }) => {
  const [formData, setFormData] = useState({
    type: 'Medical',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  
  const [days, setDays] = useState(0);

  // Calculate today's date strictly for the 'min' attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      
      // Enforce valid date boundaries logic
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive boundary
        setDays(diffDays);
      } else {
        setDays(0);
      }
    } else {
      setDays(0);
    }
  }, [formData.fromDate, formData.toDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (days <= 0) {
      alert("Invalid date range. End date must be on or after start date.");
      return;
    }
    
    const newReq = {
      id: Date.now(),
      name: user.name,
      userid: user.userid,
      role: user.role === 'hod' ? 'HOD' : user.role === 'staff' ? 'Staff' : 'Student',
      dept: user.dept || 'General',
      type: formData.type,
      days: days,
      available: 20, // Simplified limit fallback
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason
    };
    
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      const data = await res.json();
      if (data.success) {
        if (onRequestSubmitted) onRequestSubmitted();
        alert('Leave applied successfully and routed to your Department Approvals!');
        navigate('/');
      } else {
        alert('Failed to submit leave request.');
      }
    } catch (err) {
      alert('Server unreachable. Is the backend running?');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
      <button 
        className="btn btn-outline" 
        onClick={() => navigate('/')}
        style={{ marginBottom: '1.5rem', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}
      >
        ← Cancel Application
      </button>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', borderTop: '4px solid var(--color-primary-500)' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <h1 style={{ color: 'var(--color-primary-700)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Apply for Leave</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Please fill out the form below. Standard rules apply; max 20 days combined limit.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Leave Type</label>
            <select 
              name="type" 
              className="input-field" 
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Medical">Medical Leave</option>
              <option value="OD">On Duty (OD)</option>
              <option value="Emergency">Emergency</option>
              <option value="Personal">Personal Leave</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>From Date</label>
              <input 
                type="date" 
                name="fromDate"
                className="input-field" 
                value={formData.fromDate}
                min={today}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>To Date</label>
              <input 
                type="date" 
                name="toDate"
                className="input-field" 
                value={formData.toDate}
                min={formData.fromDate || today}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Total Leave Days Calculated:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-600)' }}>{days} Day(s)</span>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Reason / Description</label>
            <textarea 
              name="reason"
              className="input-field" 
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please provide a valid explanation for your leave request..."
              rows="5"
              style={{ resize: 'vertical' }}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={days <= 0} style={{ padding: '0.75rem 2rem', fontSize: '1.05rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>
              Submit Request ➔
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
