import React from 'react';
import { 
  LayoutDashboard, 
  Grid, 
  Link2, 
  Layers, 
  SquareStack, 
  GitMerge, 
  Database, 
  Network, 
  ArrowDownUp, 
  Trophy, 
  BookOpen,
  Lock
} from 'lucide-react';
import type { ActiveTab, UserStats } from '../types';
import { isTabLocked } from '../utils/storage';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
  languageMode: 'technical' | 'analogy';
  setLanguageMode: (mode: 'technical' | 'analogy') => void;
  questMode: boolean;
  setQuestMode: (mode: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ToggleSwitch: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      <div 
        onClick={onChange}
        style={{
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          background: checked ? 'var(--accent-pink)' : 'var(--bg-tertiary)',
          border: '2px solid var(--text-primary)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s ease'
        }}
      >
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'var(--text-primary)',
          position: 'absolute',
          top: '2px',
          left: checked ? '18px' : '2px',
          transition: 'left 0.2s ease',
        }} />
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  stats,
  languageMode,
  setLanguageMode,
  questMode,
  setQuestMode,
  isOpen,
  onClose
}) => {
  const prevLevelXp = (stats.level - 1) * 300;
  const currentLevelProgress = stats.xp - prevLevelXp;
  const nextLevelRequirement = 300;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelProgress / nextLevelRequirement) * 100));

  const navigationItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { tab: 'array', label: 'Array', icon: <Grid size={18} /> },
    { tab: 'linked-list', label: 'Linked List', icon: <Link2 size={18} /> },
    { tab: 'stack', label: 'Stack', icon: <Layers size={18} /> },
    { tab: 'queue', label: 'Queue', icon: <SquareStack size={18} /> },
    { tab: 'tree', label: 'Tree (BST / AVL)', icon: <GitMerge size={18} /> },
    { tab: 'heap', label: 'Heap (Min / Max)', icon: <Database size={18} /> },
    { tab: 'hash-table', label: 'Hash Table', icon: <Database size={18} /> },
    { tab: 'graph', label: 'Graph Visualizer', icon: <Network size={18} /> },
    { tab: 'sort-search', label: 'Sorting & Searching', icon: <ArrowDownUp size={18} /> },
    { tab: 'interview', label: 'Interview Mode', icon: <Trophy size={18} /> }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className={`drawer-panel ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Drawer Header */}
          <div className="drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen style={{ color: 'var(--accent-pink)' }} size={24} />
              <h2 className="drawer-title">
                Menu<span className="logo-dot">.</span>
              </h2>
            </div>
            <button className="drawer-close-btn" onClick={onClose}>
              Close
            </button>
          </div>

          {/* User Progress Panel */}
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '2px solid var(--text-primary)',
            borderRadius: '8px',
            padding: '14px',
            marginBottom: '20px',
            boxShadow: '2px 2px 0px var(--text-primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700 }}>Level {stats.level}</span>
              <span style={{ fontSize: '13px', color: 'var(--accent-pink)', fontWeight: 700 }}>{stats.xp} XP</span>
            </div>
            <div style={{
              height: '8px',
              background: '#ffffff',
              border: '2px solid var(--text-primary)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '6px',
              position: 'relative'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'var(--accent-pink)',
                transition: 'width 0.4s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span>{currentLevelProgress} / {nextLevelRequirement} XP</span>
            </div>
          </div>

          {/* Navigation Options */}
          <nav style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px', 
            overflowY: 'auto', 
            flex: 1, 
            paddingRight: '4px',
            marginBottom: '20px'
          }}>
            {navigationItems.map((item) => {
              const locked = isTabLocked(item.tab, stats, questMode);
              return (
                <div 
                  key={item.tab}
                  onClick={() => {
                    if (!locked) {
                      setActiveTab(item.tab);
                      onClose();
                    }
                  }}
                  className={`nav-link ${activeTab === item.tab ? 'active' : ''}`}
                  style={locked ? {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  } : {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.icon}
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</span>
                  </div>
                  {locked && <Lock size={14} style={{ color: 'var(--text-muted)' }} />}
                </div>
              );
            })}
          </nav>

          {/* Bottom Settings Switch Area */}
          <div style={{
            borderTop: '2px solid var(--text-primary)',
            paddingTop: '16px'
          }}>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '2px solid var(--text-primary)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              boxShadow: '2px 2px 0px var(--text-primary)'
            }}>
              <h3 style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Accessibility</h3>
              <ToggleSwitch 
                label="Quest Mode" 
                checked={questMode} 
                onChange={() => setQuestMode(!questMode)} 
              />
              <ToggleSwitch 
                label="Analogy Mode" 
                checked={languageMode === 'analogy'} 
                onChange={() => setLanguageMode(languageMode === 'technical' ? 'analogy' : 'technical')} 
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <a 
                href="https://forms.gle/HxjAHSDfFK6KjPY4A"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  color: 'var(--accent-pink)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '2px solid var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'var(--bg-secondary)',
                  boxShadow: '2px 2px 0px var(--text-primary)',
                  transition: 'var(--transition-smooth)',
                  cursor: 'pointer'
                }}
              >
                Share Feedback
              </a>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Developed for Placements © 2026</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
