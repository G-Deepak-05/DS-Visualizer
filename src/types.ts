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
  | 'interview';

export interface VisualizerStep {
  stepNumber: number;
  explanation: string;
  analogyExplanation?: string;
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

// Annotation for help overlay
export interface Annotation {
  id: string; // unique identifier
  selector: string; // CSS selector of the element to annotate
  text: string; // explanatory text
  arrow?: 'top' | 'right' | 'bottom' | 'left'; // optional arrow direction
  color?: string; // optional color for the annotation
}
