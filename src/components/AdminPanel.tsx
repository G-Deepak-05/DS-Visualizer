import React, { useState } from 'react';
import { Users, BarChart3, Plus, Shield, CheckCircle } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'analytics' | 'tutorials'>('users');
  const [successMsg, setSuccessMsg] = useState('');

  // Mock accounts
  const users = [
    { name: 'Bruce Wayne', email: 'batman@gotham.com', level: 4, xp: 950, role: 'Admin' },
    { name: 'Clark Kent', email: 'superman@metropolis.com', level: 2, xp: 450, role: 'User' },
    { name: 'Diana Prince', email: 'wonder@themyscira.org', level: 3, xp: 750, role: 'User' },
    { name: 'Barry Allen', email: 'flash@centralcity.gov', level: 1, xp: 120, role: 'User' }
  ];

  // Forms
  const [tutTitle, setTutTitle] = useState('');
  const [tutCategory, setTutCategory] = useState('array');
  const [tutSteps, setTutSteps] = useState('');

  const handleCreateTutorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutTitle.trim() || !tutSteps.trim()) return alert("Fill in title and steps.");
    
    setSuccessMsg(`Tutorial "${tutTitle}" added to playground database successfully!`);
    setTutTitle('');
    setTutSteps('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Admin tabs */}
      <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} style={{ color: 'var(--accent-indigo)' }} /> Admin Controls
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            onClick={() => setActiveSubTab('users')}
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              background: activeSubTab === 'users' ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: activeSubTab === 'users' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Users size={16} /> Manage Users
          </div>
          
          <div 
            onClick={() => setActiveSubTab('analytics')}
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              background: activeSubTab === 'analytics' ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: activeSubTab === 'analytics' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <BarChart3 size={16} /> System Analytics
          </div>

          <div 
            onClick={() => setActiveSubTab('tutorials')}
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              background: activeSubTab === 'tutorials' ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: activeSubTab === 'tutorials' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Plus size={16} /> Add Tutorials
          </div>
        </div>
      </div>

      {/* Admin content area */}
      <div className="glass-panel" style={{ minHeight: '340px' }}>
        
        {/* Users Management */}
        {activeSubTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Simulated User Accounts</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>Name</th>
                    <th style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>Email</th>
                    <th style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>Level</th>
                    <th style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>XP</th>
                    <th style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>Lvl {u.level}</td>
                      <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>{u.xp} XP</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: u.role === 'Admin' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                          color: u.role === 'Admin' ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                          fontWeight: 600
                        }}>{u.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Analytics */}
        {activeSubTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Platform Activity Analytics</h2>
            
            {/* Visual graph metric indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VISUALIZATIONS RUN</span>
                <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: 'var(--accent-cyan)' }}>1,420 / day</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CHALLENGES SOLVED</span>
                <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: 'var(--accent-emerald)' }}>645 / day</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVG. USER SESSION TIME</span>
                <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: 'var(--accent-amber)' }}>14.8 mins</div>
              </div>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Resource Load (Simulated)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Browser CPU Thread Usage</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>12%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '12%', height: '100%', background: 'var(--accent-emerald)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Local Storage quota allocation</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>4.2 KB / 5.0 MB</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '2%', height: '100%', background: 'var(--accent-indigo)' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Tutorials */}
        {activeSubTab === 'tutorials' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Publish Custom Tutorial Steps</h2>
            
            <form onSubmit={handleCreateTutorial} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Tutorial Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Understanding AVL rotation path" 
                  className="custom-input"
                  value={tutTitle}
                  onChange={e => setTutTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>DS Category</label>
                <select 
                  className="custom-select" 
                  value={tutCategory} 
                  onChange={e => setTutCategory(e.target.value)}
                >
                  <option value="array">Array</option>
                  <option value="linked-list">Linked List</option>
                  <option value="stack">Stack</option>
                  <option value="tree">Tree</option>
                  <option value="graph">Graph</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Granular Steps (Comma-separated text)</label>
                <textarea 
                  placeholder="Step 1: Check nodes, Step 2: Swap links, Step 3: Perform Rotations" 
                  className="custom-input"
                  rows={4}
                  value={tutSteps}
                  onChange={e => setTutSteps(e.target.value)}
                  style={{ fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="control-btn active" style={{ justifyContent: 'center' }}>
                Publish Lesson
              </button>
            </form>

            {successMsg && (
              <div style={{
                marginTop: '20px',
                padding: '12px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={16} />
                {successMsg}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
