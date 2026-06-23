import type { UserStats, Badge, Activity, ActiveTab } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'array-master',
    title: 'Array Master',
    description: 'Mastered insertion, deletion, and shifting in Arrays',
    iconName: 'Grid',
    color: '#06b6d4'
  },
  {
    id: 'linked-list-wizard',
    title: 'Linked List Wizard',
    description: 'Reversed a linked list and navigated circular node pointers',
    iconName: 'Link',
    color: '#3b82f6'
  },
  {
    id: 'stack-slinger',
    title: 'Stack Slinger',
    description: 'Successfully pushed and popped items from stack limits',
    iconName: 'Layers',
    color: '#a855f7'
  },
  {
    id: 'queue-commander',
    title: 'Queue Commander',
    description: 'Managed front and rear pointers in Deque and Circular Queues',
    iconName: 'SquareStack',
    color: '#10b981'
  },
  {
    id: 'tree-expert',
    title: 'Tree Expert',
    description: 'Completed in-order traversals and self-balancing AVL rotations',
    iconName: 'GitMerge',
    color: '#f59e0b'
  },
  {
    id: 'graph-guru',
    title: 'Graph Guru',
    description: 'Solved Shortest Path using Dijkstra and traversed with BFS/DFS',
    iconName: 'Network',
    color: '#6366f1'
  },
  {
    id: 'dsa-champion',
    title: 'DSA Champion',
    description: 'Earned 1000 XP and unlocked all core visualizer achievements',
    iconName: 'Trophy',
    color: '#f43f5e'
  }
];

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  completedLessons: [],
  unlockedBadges: [],
  recentActivity: []
};

export const loadStats = (): UserStats => {
  const data = localStorage.getItem('ds_visualizer_stats');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_STATS;
    }
  }
  return DEFAULT_STATS;
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem('ds_visualizer_stats', JSON.stringify(stats));
};

export const addXP = (amount: number, stats: UserStats, activityName: string, type: 'visualization' | 'challenge' | 'quiz'): UserStats => {
  const newXp = stats.xp + amount;
  const newLevel = Math.floor(newXp / 300) + 1; // 300 XP per level
  
  const activity: Activity = {
    id: Date.now().toString(),
    type,
    name: activityName,
    xpEarned: amount,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const recentActivity = [activity, ...stats.recentActivity].slice(0, 8);
  
  // Check for badge unlocks
  const unlockedBadges = [...stats.unlockedBadges];
  
  // 1. Array Master check
  if (type === 'challenge' && activityName.includes('Array') && !unlockedBadges.some(b => b.id === 'array-master')) {
    const b = ALL_BADGES.find(x => x.id === 'array-master');
    if (b) unlockedBadges.push({ ...b, unlockedAt: new Date().toLocaleDateString() });
  }

  // 2. Linked List Wizard check
  if (type === 'challenge' && activityName.includes('List') && !unlockedBadges.some(b => b.id === 'linked-list-wizard')) {
    const b = ALL_BADGES.find(x => x.id === 'linked-list-wizard');
    if (b) unlockedBadges.push({ ...b, unlockedAt: new Date().toLocaleDateString() });
  }

  // 3. Stack Slinger check
  if (activityName.includes('Stack') && !unlockedBadges.some(b => b.id === 'stack-slinger')) {
    const b = ALL_BADGES.find(x => x.id === 'stack-slinger');
    if (b) unlockedBadges.push({ ...b, unlockedAt: new Date().toLocaleDateString() });
  }

  // 4. Queue Commander check
  if (activityName.includes('Queue') && !unlockedBadges.some(b => b.id === 'queue-commander')) {
    const b = ALL_BADGES.find(x => x.id === 'queue-commander');
    if (b) unlockedBadges.push({ ...b, unlockedAt: new Date().toLocaleDateString() });
  }

  // 5. Tree Expert check
  if (activityName.includes('Tree') && !unlockedBadges.some(b => b.id === 'tree-expert')) {
    const b = ALL_BADGES.find(x => x.id === 'tree-expert');
    if (b) unlockedBadges.push({ ...b, unlockedAt: new Date().toLocaleDateString() });
  }

  // 6. Graph Guru check
  if (activityName.includes('Graph') && !unlockedBadges.some(b => b.id === 'graph-guru')) {
    const b = ALL_BADGES.find(x => x.id === 'graph-guru');
    if (b) unlockedBadges.push({ ...b, unlockedAt: new Date().toLocaleDateString() });
  }

  // 7. DSA Champion check
  if (newXp >= 1000 && !unlockedBadges.some(b => b.id === 'dsa-champion')) {
    const b = ALL_BADGES.find(x => x.id === 'dsa-champion');
    if (b) unlockedBadges.push({ ...b, unlockedAt: new Date().toLocaleDateString() });
  }

  const updatedStats = {
    ...stats,
    xp: newXp,
    level: newLevel,
    unlockedBadges,
    recentActivity
  };

  saveStats(updatedStats);
  return updatedStats;
};

export const isTabLocked = (tab: ActiveTab, stats: UserStats, questMode: boolean): boolean => {
  if (!questMode) return false;
  if (tab === 'dashboard') return false;
  if (stats.level >= 4) return false;
  
  if (stats.level === 3) {
    return ['graph', 'interview'].includes(tab);
  }
  if (stats.level === 2) {
    return ['tree', 'heap', 'hash-table', 'graph', 'interview'].includes(tab);
  }
  if (stats.level === 1) {
    return ['linked-list', 'queue', 'sort-search', 'tree', 'heap', 'hash-table', 'graph', 'interview'].includes(tab);
  }
  return false;
};
