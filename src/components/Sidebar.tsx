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
  Settings,
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
}

const ToggleSwitch: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <div 
        onClick={onChange}
        style={{
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          background: checked ? 'var(--accent-indigo)' : 'var(--bg-tertiary)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.3s ease'
        }}
      >
        <div style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: '2px',
          left: checked ? '18px' : '2px',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
  setQuestMode
}) => {
  const prevLevelXp = (stats.level - 1) * 300;
  const currentLevelProgress = stats.xp - prevLevelXp;
  const nextLevelRequirement = 300;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelProgress / nextLevelRequirement) * 100));

  const navigationItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { tab: 'array', label: 'Array', icon: <Grid size={20} /> },
    { tab: 'linked-list', label: 'Linked List', icon: <Link2 size={20} /> },
    { tab: 'stack', label: 'Stack', icon: <Layers size={20} /> },
    { tab: 'queue', label: 'Queue', icon: <SquareStack size={20} /> },
    { tab: 'tree', label: 'Tree (BST / AVL)', icon: <GitMerge size={20} /> },
    { tab: 'heap', label: 'Heap (Min / Max)', icon: <Database size={20} /> },
    { tab: 'hash-table', label: 'Hash Table', icon: <Database size={20} /> },
    { tab: 'graph', label: 'Graph Visualizer', icon: <Network size={20} /> },
    { tab: 'sort-search', label: 'Sorting & Searching', icon: <ArrowDownUp size={20} /> },
    { tab: 'interview', label: 'Interview Mode', icon: <Trophy size={20} /> },
    { tab: 'admin', label: 'Admin Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--glass-border)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      justifyContent: 'space-between'
    }}>
      <div>
        {/* App Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
          <BookOpen style={{ color: 'var(--accent-indigo)' }} size={28} />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              DS <span className="text-gradient-cyan-blue">Visualizer</span>
            </h1>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>DSA Learning Hub</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Level {stats.level}</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{stats.xp} XP</span>
          </div>
          <div style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '4px'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-cyan))',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>{currentLevelProgress} / {nextLevelRequirement} XP</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: 'calc(100vh - 440px)', paddingRight: '4px' }}>
          {navigationItems.map((item) => {
            const locked = isTabLocked(item.tab, stats, questMode);
            return (
              <div 
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
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
                  <span style={{ fontSize: '14px' }}>{item.label}</span>
                </div>
                {locked && <Lock size={14} style={{ color: 'var(--text-muted)' }} />}
              </div>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Settings Toggles */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Accessibility</h3>
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
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Developed for Placements © 2026</p>
        </div>
      </div>
    </div>
  );
};
