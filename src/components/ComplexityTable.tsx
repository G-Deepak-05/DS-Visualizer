import React from 'react';
import type { ActiveTab } from '../types';

interface ComplexityTableProps {
  type: ActiveTab;
}

interface ComplexityRow {
  operation: string;
  best: string;
  average: string;
  worst: string;
  space: string;
}

const COMPLEXITY_MAP: Record<string, ComplexityRow[]> = {
  array: [
    { operation: 'Access / Read', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Search (Linear)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Insertion', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Deletion', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' }
  ],
  'linked-list': [
    { operation: 'Access / Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Insert / Delete at Head', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Insert / Delete at Tail', best: 'O(1) / O(n)', average: 'O(1) / O(n)', worst: 'O(1) / O(n)', space: 'O(1)' },
    { operation: 'Insert / Delete at Position', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' }
  ],
  stack: [
    { operation: 'Push', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Pop', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'IsEmpty', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  ],
  queue: [
    { operation: 'Enqueue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Dequeue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  ],
  tree: [
    { operation: 'BST Search', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'BST Insertion', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'BST Deletion', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'AVL Balance Check', best: 'O(1)', average: 'O(1)', worst: 'O(log n)', space: 'O(log n)' }
  ],
  heap: [
    { operation: 'Get Min / Max', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Insert (Heapify-up)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'Delete Min/Max (Heapify-down)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'Heapify Array', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' }
  ],
  'hash-table': [
    { operation: 'Search / Access', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Insertion', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Deletion', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' }
  ],
  graph: [
    { operation: 'BFS Traversal', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    { operation: 'DFS Traversal', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    { operation: 'Dijkstra (Shortest Path)', best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)' },
    { operation: 'Kruskal (MST)', best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', space: 'O(V + E)' }
  ],
  'sort-search': [
    { operation: 'Bubble Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    { operation: 'Quick Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    { operation: 'Merge Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { operation: 'Binary Search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' }
  ]
};

export const ComplexityTable: React.FC<ComplexityTableProps> = ({ type }) => {
  const rows = COMPLEXITY_MAP[type] || [];

  if (rows.length === 0) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 600 }}>
        Complexity Analyzer (Big-O)
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '8px 4px', color: 'var(--text-muted)', fontWeight: 500 }}>Operation</th>
              <th style={{ padding: '8px 4px', color: 'var(--accent-emerald)', fontWeight: 500 }}>Best</th>
              <th style={{ padding: '8px 4px', color: 'var(--accent-amber)', fontWeight: 500 }}>Avg</th>
              <th style={{ padding: '8px 4px', color: 'var(--accent-rose)', fontWeight: 500 }}>Worst</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '10px 4px', fontWeight: 500, color: 'var(--text-secondary)' }}>{row.operation}</td>
                <td style={{ padding: '10px 4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>{row.best}</td>
                <td style={{ padding: '10px 4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>{row.average}</td>
                <td style={{ padding: '10px 4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>{row.worst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '6px',
        fontSize: '11px',
        color: 'var(--text-muted)',
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }}>
        <span>Auxiliary Space Complexity: </span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
          {rows[0]?.space || 'O(1)'}
        </span>
      </div>
    </div>
  );
};
