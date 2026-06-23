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
import { AdminPanel } from './components/AdminPanel';
import type { ActiveTab, UserStats } from './types';
import { loadStats, addXP } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    completedLessons: [],
    unlockedBadges: [],
    recentActivity: []
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleAddXP = (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz' = 'visualization') => {
    const updated = addXP(amount, stats, name, type);
    setStats(updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} setActiveTab={setActiveTab} />;
      case 'array':
        return <ArrayVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'linked-list':
        return <LinkedListVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'stack':
        return <StackVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'queue':
        return <QueueVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'tree':
        return <TreeVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'heap':
        return <HeapVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'hash-table':
        return <HashTableVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'graph':
        return <GraphVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'sort-search':
        return <SortSearchVisualizer onAddXP={(amount, name) => handleAddXP(amount, name, 'visualization')} />;
      case 'interview':
        return <InterviewMode onAddXP={handleAddXP} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
