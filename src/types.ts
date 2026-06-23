export type ActiveTab = 
  | 'dashboard'
  | 'array'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'tree'
  | 'heap'
  | 'hash-table'
  | 'graph'
  | 'sort-search'
  | 'interview'
  | 'admin';

export interface VisualizerStep {
  stepNumber: number;
  explanation: string;
  codeLine?: number;
  state: any; // visual state representation
}

export interface UserStats {
  xp: number;
  level: number;
  completedLessons: string[];
  unlockedBadges: Badge[];
  recentActivity: Activity[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  unlockedAt?: string;
}

export interface Activity {
  id: string;
  type: 'visualization' | 'challenge' | 'quiz';
  name: string;
  xpEarned: number;
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ActiveTab;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  initialState: any;
  targetState: any;
  hint: string;
  instructions: string;
}
