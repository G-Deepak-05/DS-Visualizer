import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ArrayVisualizer } from './components/visualizers/ArrayVisualizer';
import { LinkedListVisualizer } from './components/visualizers/LinkedListVisualizer';
import { StackVisualizer } from './components/visualizers/StackVisualizer';
import { QueueVisualizer } from './components/visualizers/QueueVisualizer';
import { TreeVisualizer } from './components/visualizers/TreeVisualizer';
import { HeapVisualizer } from './components/visualizers/HeapVisualizer';
import { HashTableVisualizer } from './components/visualizers/HashTableVisualizer';
import { GraphVisualizer } from './components/visualizers/GraphVisualizer';
import { SortSearchVisualizer } from './components/visualizers/SortSearchVisualizer';
import { InterviewMode } from './components/InterviewMode';
import type { ActiveTab, UserStats } from './types';
import { loadStats, addXP, isTabLocked } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    completedLessons: [],
    unlockedBadges: [],
    recentActivity: []
  });

  // accessibility Improvements Config State
  const [languageMode, setLanguageMode] = useState<'technical' | 'analogy'>('technical');
  const [questMode, setQuestMode] = useState<boolean>(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Load stats from localStorage on mount
  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleAddXP = (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz' = 'visualization') => {
    const updated = addXP(amount, stats, name, type);
    setStats(updated);
  };

  const handleSwitchTab = (tab: ActiveTab) => {
    if (isTabLocked(tab, stats, questMode)) {
      alert(`🔒 Topic Locked! Earn more XP to Level Up and unlock this topic.`);
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} setActiveTab={handleSwitchTab} questMode={questMode} />;
      case 'array':
        return <ArrayVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'linked-list':
        return <LinkedListVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'stack':
        return <StackVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'queue':
        return <QueueVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'tree':
        return <TreeVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'heap':
        return <HeapVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'hash-table':
        return <HashTableVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'graph':
        return <GraphVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'sort-search':
        return <SortSearchVisualizer languageMode={languageMode} onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'interview':
        return <InterviewMode onAddXP={handleAddXP} />;
      default:
        return <Dashboard stats={stats} setActiveTab={handleSwitchTab} questMode={questMode} />;
    }
  };

  const isPlaygroundActive = activeTab !== 'dashboard' && activeTab !== 'interview';

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo" onClick={() => handleSwitchTab('dashboard')}>
          DS Visualizer<span className="logo-dot">.</span>
        </div>
        <nav className="header-nav">
          <span 
            className={`header-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('dashboard')}
          >
            Dashboard
          </span>
          <span 
            className={`header-nav-link ${isPlaygroundActive ? 'active' : ''}`}
            onClick={() => {
              if (activeTab === 'dashboard' || activeTab === 'interview') {
                handleSwitchTab('array');
              }
              setIsDrawerOpen(true);
            }}
          >
            Playground
          </span>
          <span 
            className={`header-nav-link ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('interview')}
          >
            Interview Mode
          </span>
        </nav>
        <button className="menu-toggle-btn" onClick={() => setIsDrawerOpen(true)}>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </button>
      </header>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleSwitchTab} 
        stats={stats} 
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        questMode={questMode}
        setQuestMode={setQuestMode}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
