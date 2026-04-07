import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LeaveAnalytics = ({ user, allRequests }) => {
  // Filter active scope mapping exactly identical to personal dashboard subsets
  let targetedRequests = [];
  let titleContext = '';
  
  if (user?.role === 'principal') {
     titleContext = 'Global Institutional Leave Distribution';
     targetedRequests = allRequests.filter(req => req.status === 'Approved');
  } else {
     titleContext = 'Personal Leave Usage by Type';
     targetedRequests = allRequests.filter(r => (r.name === user?.name || r.userid === user?.userid) && r.role?.toLowerCase() === user?.role?.toLowerCase() && r.status === 'Approved');
  }

  // Aggregate dynamically across distinct leave types
  const breakdown = {};
  targetedRequests.forEach(req => {
     breakdown[req.type] = (breakdown[req.type] || 0) + req.days;
  });

  const data = Object.keys(breakdown).map(type => ({
      name: type,
      value: breakdown[type]
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (data.length === 0) {
      return (
          <div className="card glass-panel" style={{ marginTop: '2rem', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
             <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>{titleContext}</h3>
             <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No approved leave vectors collected yet to generate graph.</p>
          </div>
      );
  }

  return (
    <div className="card glass-panel" style={{ marginTop: '2rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{titleContext}</h3>
      <div style={{ flex: 1, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value) => [`${value} Days`, 'Duration']}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeaveAnalytics;
