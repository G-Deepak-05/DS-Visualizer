import React from 'react';
import { 
  Trophy, 
  Grid, 
  Link2, 
  Layers, 
  SquareStack, 
  GitMerge, 
  Database, 
  Network, 
  ArrowDownUp, 
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import type { ActiveTab, UserStats } from '../types';
import { ALL_BADGES, isTabLocked } from '../utils/storage';

interface DashboardProps {
  stats: UserStats;
  setActiveTab: (tab: ActiveTab) => void;
  questMode?: boolean;
}

const QuestChapter: React.FC<{
  levelNum: number;
  title: string;
  activeLevel: number;
  questMode: boolean;
  topics: any[];
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
}> = ({ levelNum, title, activeLevel, questMode, topics, setActiveTab, stats }) => {
  const isLocked = questMode && activeLevel < levelNum;
  const isCurrent = questMode && activeLevel === levelNum;
  
  return (
    <div style={{ display: 'flex', gap: '20px', zIndex: 1, position: 'relative', marginBottom: '24px' }}>
      {/* Chapter Indicator node */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: isLocked ? 'var(--bg-tertiary)' : isCurrent ? 'var(--accent-indigo)' : 'var(--accent-emerald)',
        border: '3px solid var(--bg-primary)',
        boxShadow: isCurrent ? '0 0 15px var(--accent-indigo)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: '#fff',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        flexShrink: 0
      }}>
        {isLocked ? <Lock size={16} style={{ color: 'var(--text-muted)' }} /> : levelNum}
      </div>

      {/* Chapter Content */}
      <div style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: '15px', 
          fontWeight: 600, 
          color: isLocked ? 'var(--text-muted)' : 'var(--text-primary)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {title}
          {isLocked && <span style={{ fontSize: '11px', color: 'var(--accent-rose)', fontWeight: 500 }}>(Locked: Reaches at Level {levelNum})</span>}
          {isCurrent && <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 500 }}>(Active Chapter)</span>}
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {topics.map((t) => {
            const topicLocked = isLocked || (questMode && isTabLocked(t.tab, stats, questMode));
            return (
              <div 
                key={t.tab}
                className="glass-card"
                onClick={() => !topicLocked && setActiveTab(t.tab)}
                style={{ 
                  cursor: topicLocked ? 'not-allowed' : 'pointer', 
                  opacity: topicLocked ? 0.4 : 1,
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'flex-start',
                  border: isCurrent && !topicLocked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isCurrent && !topicLocked ? '0 0 10px rgba(99, 102, 241, 0.1)' : 'none'
                }}
              >
                <div style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  color: topicLocked ? 'var(--text-muted)' : 'var(--accent-cyan)'
                }}>
                  {t.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <h5 style={{ fontSize: '14px', fontWeight: 600, color: topicLocked ? 'var(--text-muted)' : 'var(--text-primary)' }}>{t.title}</h5>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ stats, setActiveTab, questMode }) => {
  const nextLevelRequirement = 300;
  const prevLevelXp = (stats.level - 1) * 300;
  const currentLevelProgress = stats.xp - prevLevelXp;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelProgress / nextLevelRequirement) * 100));

  const topics: { tab: ActiveTab; title: string; desc: string; icon: React.ReactNode; level: string }[] = [
    { tab: 'array', title: 'Arrays & Vectors', desc: 'Contiguous memory buffers, shifting insertions, updates and linear searches.', icon: <Grid size={24} />, level: 'Easy' },
    { tab: 'linked-list', title: 'Linked Lists', desc: 'Node linkages, pointers traversal, Singly, Doubly, and Circular rotations.', icon: <Link2 size={24} />, level: 'Medium' },
    { tab: 'stack', title: 'Stack operations', desc: 'LIFO limits, push fall simulation, pop lift and peek bounds.', icon: <Layers size={24} />, level: 'Easy' },
    { tab: 'queue', title: 'Queue structures', desc: 'FIFO setups, Simple, Circular, Deques, and Priority queues.', icon: <SquareStack size={24} />, level: 'Easy' },
    { tab: 'tree', title: 'Binary Trees & AVL', desc: 'Hierarchical traversals (In/Pre/Post/Level) and AVL self-balancing rotations.', icon: <GitMerge size={24} />, level: 'Hard' },
    { tab: 'heap', title: 'Min / Max Heaps', desc: 'Complete trees indices mapping, heapify, bubble-up/down swaps.', icon: <Database size={24} />, level: 'Medium' },
    { tab: 'hash-table', title: 'Hash Tables', desc: 'Collisions resolution using Chaining, Linear, and Quadratic probing.', icon: <Database size={24} />, level: 'Medium' },
    { tab: 'graph', title: 'Graph Visualizer', desc: 'Pathfinding algorithms (BFS, DFS, Dijkstra, Prim, Kruskal) on custom graph nodes.', icon: <Network size={24} />, level: 'Hard' },
    { tab: 'sort-search', title: 'Sorting & Searching', desc: 'Realtime bars animation of Quick, Merge, Heap sorts, and binary search.', icon: <ArrowDownUp size={24} />, level: 'Easy' }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(25, 32, 53, 0.6), rgba(8, 11, 17, 0.8))',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
            Welcome Back, <span className="text-gradient-indigo-purple">Developer</span>!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.5' }}>
            Accelerate your data structures and algorithms preparation. Build structures, inspect step-by-step memory updates, and unlock achievements.
          </p>
        </div>
      </div>

      {/* Gamification Row */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        {/* XP Wheel Card */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="xp-circle" style={{ '--progress': `${progressPercent}%` } as any}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.level}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Level</div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>XP Progress</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              You earned <strong style={{ color: 'var(--accent-cyan)' }}>{stats.xp} XP</strong> in total. Get {300 - currentLevelProgress} XP more to reach Level {stats.level + 1}!
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Zap size={14} style={{ color: 'var(--accent-amber)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Level cap resets every 300 XP</span>
            </div>
          </div>
        </div>

        {/* Badges Overview */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy style={{ color: 'var(--accent-amber)' }} size={20} /> Unlocked Badges ({stats.unlockedBadges.length} / {ALL_BADGES.length})
          </h3>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
            {ALL_BADGES.map((badge) => {
              const isUnlocked = stats.unlockedBadges.some(b => b.id === badge.id);
              return (
                <div 
                  key={badge.id}
                  style={{
                    minWidth: '70px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: isUnlocked ? 1 : 0.25,
                    filter: isUnlocked ? 'none' : 'grayscale(100%)',
                    transition: 'var(--transition-smooth)'
                  }}
                  title={`${badge.title}: ${badge.description}`}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    border: `2px solid ${badge.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '6px',
                    boxShadow: isUnlocked ? `0 0 10px ${badge.color}40` : 'none'
                  }}>
                    <Trophy size={20} style={{ color: badge.color }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center', color: 'var(--text-primary)' }}>
                    {badge.title.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Sections Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Core Topics List */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
            {questMode ? 'DSA Quest Roadmap' : 'Data Structure Playgrounds'}
          </h3>

          {questMode ? (
            <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
              {/* Vertical dotted path running through the left side of chapter indicators */}
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '43px',
                bottom: '40px',
                width: '2px',
                background: 'linear-gradient(to bottom, var(--accent-indigo), var(--accent-cyan), var(--bg-tertiary))',
                zIndex: 0,
                opacity: 0.4
              }} />

              {/* Level 1 Chapter */}
              <QuestChapter 
                levelNum={1} 
                title="Chapter 1: Contiguous & LIFO Storage" 
                activeLevel={stats.level} 
                questMode={!!questMode}
                topics={topics.filter(t => ['array', 'stack'].includes(t.tab))}
                setActiveTab={setActiveTab}
                stats={stats}
              />

              {/* Level 2 Chapter */}
              <QuestChapter 
                levelNum={2} 
                title="Chapter 2: Linear Nodes, Queues & Ordering" 
                activeLevel={stats.level} 
                questMode={!!questMode}
                topics={topics.filter(t => ['linked-list', 'queue', 'sort-search'].includes(t.tab))}
                setActiveTab={setActiveTab}
                stats={stats}
              />

              {/* Level 3 Chapter */}
              <QuestChapter 
                levelNum={3} 
                title="Chapter 3: Hierarchies & Hashing" 
                activeLevel={stats.level} 
                questMode={!!questMode}
                topics={topics.filter(t => ['tree', 'heap', 'hash-table'].includes(t.tab))}
                setActiveTab={setActiveTab}
                stats={stats}
              />

              {/* Level 4 Chapter */}
              <QuestChapter 
                levelNum={4} 
                title="Chapter 4: Complex Networks & Pathfinding" 
                activeLevel={stats.level} 
                questMode={!!questMode}
                topics={topics.filter(t => ['graph'].includes(t.tab))}
                setActiveTab={setActiveTab}
                stats={stats}
              />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {topics.map((t) => {
                const topicLocked = isTabLocked(t.tab, stats, !!questMode);
                return (
                  <div 
                    key={t.tab} 
                    className="glass-card" 
                    onClick={() => !topicLocked && setActiveTab(t.tab)}
                    style={{ 
                      cursor: topicLocked ? 'not-allowed' : 'pointer', 
                      display: 'flex', 
                      gap: '16px', 
                      alignItems: 'flex-start',
                      opacity: topicLocked ? 0.5 : 1
                    }}
                  >
                    <div style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'var(--bg-tertiary)',
                      color: topicLocked ? 'var(--text-muted)' : 'var(--accent-indigo)'
                    }}>
                      {t.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: topicLocked ? 'var(--text-muted)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {t.title}
                          {topicLocked && <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
                        </h4>
                        <span style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: t.level === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : t.level === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          color: t.level === 'Easy' ? 'var(--accent-emerald)' : t.level === 'Medium' ? 'var(--accent-amber)' : 'var(--accent-rose)',
                          fontWeight: 600
                        }}>{t.level}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent activity & Tips */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Recent Logs</h3>
          <div className="glass-panel" style={{ padding: '20px', minHeight: '340px' }}>
            {stats.recentActivity.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontSize: '13px' }}>No activities logged yet.</p>
                <p style={{ fontSize: '11px', textAlign: 'center', marginTop: '4px' }}>Start by visualizing or doing interview challenges!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    paddingBottom: '10px'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{activity.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{activity.timestamp} • {activity.type}</span>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--accent-emerald)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>+{activity.xpEarned} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
