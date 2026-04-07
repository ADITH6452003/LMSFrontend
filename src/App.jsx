import React, { useState, useEffect } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Login from './components/Auth/Login';
import LeaveApprovals from './pages/LeaveApprovals';
import HodLeaveDetails from './pages/HodLeaveDetails';
import ApplyLeave from './pages/ApplyLeave';
import ViewLeave from './pages/ViewLeave';
import ManageUsers from './pages/ManageUsers';
import LeaveAnalytics from './components/LeaveAnalytics';

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedHod, setSelectedHod] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsersState] = useState([]);
  const [pendingRequests, setPendingRequestsState] = useState([]);

  // Load users and requests from backend on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchRequests();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsersState(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      setPendingRequestsState(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const handleLogin = async (role, formData) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, ...formData })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        setCurrentPath('/');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Server unreachable. Is the backend running?' };
    }
  };

  const handleChangePassword = async (role, formData) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, userid: formData.userid, dept: formData.dept, oldPassword: formData.password, newPassword: formData.newPassword })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Server unreachable.' };
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUsersState([]);
    setPendingRequestsState([]);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const navigate = (path) => setCurrentPath(path);

  const handleUpdateStatus = async (reqId, newStatus) => {
    try {
      await fetch(`/api/requests/${reqId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      await fetchRequests();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onChangePassword={handleChangePassword} />;
  }

  const visiblePendingRequests = pendingRequests.filter(req => {
    if (req.status && req.status !== 'Pending') return false;
    if (user?.role === 'principal') return req.role === 'HOD';
    if (user?.role === 'hod') return req.dept === user?.dept && req.role === 'Staff';
    if (user?.role === 'staff') {
      if (req.dept !== user?.dept || req.role !== 'Student' || !req.userid) return false;
      const studentAccount = users.find(u => u.userid === req.userid && u.role === 'student');
      return studentAccount && studentAccount.assignedStaff === user?.userid;
    }
    return false;
  });

  const renderContent = () => {
    if (currentPath === '/approvals') {
      return (
        <LeaveApprovals
          pendingRequests={visiblePendingRequests}
          allRequests={pendingRequests}
          user={user}
          users={users}
          onUpdateStatus={handleUpdateStatus}
          onHodSelect={(hod) => {
            setSelectedHod(hod);
            navigate('/hod-leave-details');
          }}
        />
      );
    }

    if (currentPath === '/hod-leave-details') {
      return <HodLeaveDetails hod={selectedHod} navigate={navigate} />;
    }

    if (currentPath === '/apply') {
      return <ApplyLeave navigate={navigate} user={user} onRequestSubmitted={fetchRequests} />;
    }

    if (currentPath === '/view-leave') {
      return <ViewLeave user={user} navigate={navigate} pendingRequests={pendingRequests} />;
    }

    if (currentPath === '/manage-users') {
      return <ManageUsers user={user} users={users} onUsersChanged={fetchUsers} navigate={navigate} />;
    }

    const userPendingCount = pendingRequests.filter(r =>
      (r.name === user?.name || r.userid === user?.userid) &&
      r.role?.toLowerCase() === user?.role?.toLowerCase() &&
      (!r.status || r.status === 'Pending')
    ).length;

    const personalApprovedLeaves = pendingRequests.filter(r =>
      (r.name === user?.name || r.userid === user?.userid) &&
      r.role?.toLowerCase() === user?.role?.toLowerCase() &&
      r.status === 'Approved'
    );
    const personalTaken = personalApprovedLeaves.reduce((sum, req) => sum + req.days, 0);
    const personalRemaining = 20 - personalTaken;

    return (
      <>
        <div className="card">
          <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary-700)' }}>
            Welcome to LeaveFlow
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Logged in as: <span style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--color-text-main)' }}>{user?.role}</span>. Manage your institutional metrics directly below.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user?.role !== 'principal' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/apply')}>Apply Leave</button>
                <button className="btn btn-outline" onClick={() => navigate('/view-leave')}>View Leave</button>
              </>
            )}
            <button className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={handleLogout}>Logout</button>
            <span className="badge badge-success" style={{ marginLeft: 'auto' }}>System Online</span>
          </div>
        </div>

        {user?.role !== 'principal' && (
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="card glass-panel" style={{ borderTop: '4px solid var(--color-danger)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Leave Taken</h3>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-danger)' }}>{personalTaken}</span>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>/ 20 Days</span>
              </div>
            </div>
            <div className="card glass-panel" style={{ borderTop: '4px solid var(--color-success)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Leave Available</h3>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-success)' }}>{personalRemaining}</span>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>Days</span>
              </div>
            </div>
            <div className="card glass-panel" style={{ borderTop: '4px solid var(--color-warning)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Approvals</h3>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-warning)' }}>{userPendingCount}</span>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>Request(s)</span>
              </div>
            </div>
          </div>
        )}

        <LeaveAnalytics user={user} allRequests={pendingRequests} />

        {user?.role === 'principal' && (
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="card glass-panel" style={{ borderTop: '4px solid var(--color-primary-500)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Active Department Staff</h3>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-text-main)' }}>{users.filter(u => u.role === 'staff').length}</span>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem', fontSize: '0.9rem' }}>Members</span>
              </div>
            </div>
            <div className="card glass-panel" style={{ borderTop: '4px solid var(--color-warning)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Global Pending Requests</h3>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-text-main)' }}>{visiblePendingRequests.length}</span>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem', fontSize: '0.9rem' }}>Items</span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <MainLayout user={user} navigate={navigate} notificationCount={user?.role === 'student' ? 0 : visiblePendingRequests.length}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;
