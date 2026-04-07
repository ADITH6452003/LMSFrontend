import React, { useState } from 'react';
import styles from './Login.module.css';

const roles = [
  { id: 'principal', title: 'Principal', icon: '🏛️' },
  { id: 'hod', title: 'HOD', icon: '👨‍🏫' },
  { id: 'staff', title: 'Staff', icon: '💼' },
  { id: 'student', title: 'Student', icon: '🎓' }
];

const Login = ({ onLogin, onChangePassword }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    userid: '',
    dept: '',
    password: '',
    newPassword: ''
  });

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setIsChangingPassword(false);
    setErrorMsg('');
    // Reset form when changing roles
    setFormData({ name: '', userid: '', dept: '', password: '', newPassword: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (isChangingPassword) {
      const result = onChangePassword(selectedRole, formData);
      if (result.success) {
        setIsChangingPassword(false);
        setFormData({ ...formData, password: '', newPassword: '' });
        alert('Password changed successfully! Please login securely with your new password.');
      } else {
        setErrorMsg(result.message || 'Failed to change password');
      }
    } else {
      const result = onLogin(selectedRole, formData);
      if (result && !result.success) {
        setErrorMsg(result.message || 'Invalid credentials');
      }
    }
  };

  // Step 1: Role Selection
  if (!selectedRole) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.selectionCard}>
          <div className={styles.brandBadge}>LMS</div>
          <h1 className={styles.title}>Welcome to LeaveFlow</h1>
          <p className={styles.subtitle}>Select your portal to continue</p>
          
          <div className={styles.roleGrid}>
            {roles.map(role => (
              <button 
                key={role.id} 
                className={styles.roleButton}
                onClick={() => handleRoleSelect(role.id)}
              >
                <span className={styles.roleIcon}>{role.icon}</span>
                <span className={styles.roleTitle}>{role.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Role-based Login Form
  return (
    <div className={styles.loginContainer}>
      <div className={`${styles.loginFormCard} ${styles.animateIn}`}>
        <button 
          type="button"
          className={styles.backButton} 
          onClick={() => setSelectedRole(null)}
        >
          ← Back to Roles
        </button>
        
        <div className={styles.formHeader}>
          <span className={styles.formIcon}>
            {roles.find(r => r.id === selectedRole)?.icon}
          </span>
          <h2 className={styles.formTitle}>
            {roles.find(r => r.id === selectedRole)?.title} Login
          </h2>
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fca5a5' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {selectedRole === 'principal' && (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Name</label>
              <input 
                type="text" 
                name="name"
                className="input-field" 
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
          )}

          {selectedRole !== 'principal' && (
             <>
               <div className={styles.inputGroup}>
                 <label className={styles.inputLabel}>User ID</label>
                 <input 
                   type="text" 
                   name="userid"
                   className="input-field" 
                   placeholder="Enter your user ID"
                   value={formData.userid}
                   onChange={handleInputChange}
                   required 
                 />
               </div>
               <div className={styles.inputGroup}>
                 <label className={styles.inputLabel}>Department</label>
                 <select 
                   name="dept"
                   className="input-field" 
                   value={formData.dept}
                   onChange={handleInputChange}
                   required 
                 >
                   <option value="">Select Department</option>
                   <option value="AIML">AIML</option>
                   <option value="AIDS">AIDS</option>
                   <option value="CSE">CSE</option>
                   <option value="CSBS">CSBS</option>
                   <option value="CCS">CCS</option>
                   <option value="ECE">ECE</option>
                   <option value="MECH">MECH</option>
                 </select>
               </div>
             </>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>{isChangingPassword ? 'Old Password' : 'Password'}</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              placeholder={isChangingPassword ? "Enter old password" : "Enter your password"}
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          {isChangingPassword && (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>New Password</label>
              <input 
                type="password" 
                name="newPassword"
                className="input-field" 
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required 
              />
            </div>
          )}

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            {isChangingPassword ? 'Update Password' : 'Proceed securely'}
          </button>
          
          {selectedRole !== 'principal' && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setErrorMsg('');
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isChangingPassword ? 'Back to Login' : 'Change Password?'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
