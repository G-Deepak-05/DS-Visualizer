import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import type { ActiveTab } from '../types';

interface CodeExecutorProps {
  structureType: ActiveTab;
  onExecuteCommands: (commands: { action: string; params: any[] }[]) => void;
}

const TEMPLATES: Record<string, Record<string, string>> = {
  array: {
    Python: `arr = []\narr.insert(0, 10)\narr.insert(1, 20)\narr.insert(2, 30)\narr.update(1, 99)\narr.delete(0)`,
    Java: `ArrayList<Integer> arr = new ArrayList<>();\narr.add(0, 10);\narr.add(1, 20);\narr.add(2, 30);\narr.set(1, 99);\narr.remove(0);`,
    'C++': `vector<int> arr;\narr.insert(arr.begin() + 0, 10);\narr.insert(arr.begin() + 1, 20);\narr.insert(arr.begin() + 2, 30);\narr.at(1) = 99;\narr.erase(arr.begin() + 0);`,
    JavaScript: `let arr = [];\narr.splice(0, 0, 10);\narr.splice(1, 0, 20);\narr.splice(2, 0, 30);\narr.splice(1, 1, 99);\narr.splice(0, 1);`
  },
  'linked-list': {
    Python: `list.insertHead(15)\nlist.insertTail(25)\nlist.insertHead(5)\nlist.reverse()`,
    Java: `LinkedList list = new LinkedList();\nlist.insertHead(15);\nlist.insertTail(25);\nlist.insertHead(5);\nlist.reverse();`,
    'C++': `LinkedList list;\nlist.insertHead(15);\nlist.insertTail(25);\nlist.insertHead(5);\nlist.reverse();`,
    JavaScript: `const list = new LinkedList();\nlist.insertHead(15);\nlist.insertTail(25);\nlist.insertHead(5);\nlist.reverse();`
  },
  stack: {
    Python: `stack.push(10)\nstack.push(20)\nstack.push(30)\nstack.pop()\nstack.push(40)`,
    Java: `Stack<Integer> stack = new Stack<>();\nstack.push(10);\nstack.push(20);\nstack.push(30);\nstack.pop();\nstack.push(40);`,
    'C++': `stack<int> stack;\nstack.push(10);\nstack.push(20);\nstack.push(30);\nstack.pop();\nstack.push(40);`,
    JavaScript: `let stack = [];\nstack.push(10);\nstack.push(20);\nstack.push(30);\nstack.pop();\nstack.push(40);`
  },
  queue: {
    Python: `q.enqueue(10)\nq.enqueue(20)\nq.enqueue(30)\nq.dequeue()`,
    Java: `Queue<Integer> q = new LinkedList<>();\nq.add(10);\nq.add(20);\nq.add(30);\nq.remove();`,
    'C++': `queue<int> q;\nq.push(10);\nq.push(20);\nq.push(30);\nq.pop();`,
    JavaScript: `let q = [];\nq.push(10); // enqueue\nq.push(20);\nq.push(30);\nq.shift(); // dequeue`
  },
  tree: {
    Python: `tree.insert(50)\ntree.insert(30)\ntree.insert(70)\ntree.insert(20)\ntree.search(30)`,
    Java: `BinarySearchTree tree = new BinarySearchTree();\ntree.insert(50);\ntree.insert(30);\ntree.insert(70);\ntree.insert(20);\ntree.search(30);`,
    'C++': `BST tree;\ntree.insert(50);\ntree.insert(30);\ntree.insert(70);\ntree.insert(20);\ntree.search(30);`,
    JavaScript: `const tree = new BinarySearchTree();\ntree.insert(50);\ntree.insert(30);\ntree.insert(70);\ntree.insert(20);\ntree.search(30);`
  },
  heap: {
    Python: `heap.insert(40)\nheap.insert(25)\nheap.insert(50)\nheap.delete()`,
    Java: `PriorityQueue<Integer> heap = new PriorityQueue<>();\nheap.add(40);\nheap.add(25);\nheap.add(50);\nheap.poll();`,
    'C++': `priority_queue<int> heap;\nheap.push(40);\nheap.push(25);\nheap.push(50);\nheap.pop();`,
    JavaScript: `const heap = new MinHeap();\nheap.insert(40);\nheap.insert(25);\nheap.insert(50);\nheap.delete();`
  },
  'hash-table': {
    Python: `hash.insert(10) # 10 % size\nhash.insert(20)\nhash.insert(15) # collision\nhash.search(15)`,
    Java: `HashTable hash = new HashTable(10);\nhash.put(10);\nhash.put(20);\nhash.put(15);\nhash.get(15);`,
    'C++': `HashTable hash(10);\nhash.insert(10);\nhash.insert(20);\nhash.insert(15);\nhash.search(15);`,
    JavaScript: `const hash = new HashTable(10);\nhash.insert(10);\nhash.insert(20);\nhash.insert(15);\nhash.search(15);`
  },
  graph: {
    Python: `graph.addNode("A")\ngraph.addNode("B")\ngraph.addNode("C")\ngraph.addEdge("A", "B", 4)\ngraph.addEdge("B", "C", 2)\ngraph.bfs("A")`,
    Java: `Graph g = new Graph();\ng.addNode("A");\ng.addNode("B");\ng.addNode("C");\ng.addEdge("A", "B", 4);\ng.addEdge("B", "C", 2);\ng.bfs("A");`,
    'C++': `Graph g;\ng.addNode("A");\ng.addNode("B");\ng.addNode("C");\ng.addEdge("A", "B", 4);\ng.addEdge("B", "C", 2);\ng.bfs("A");`,
    JavaScript: `const g = new Graph();\ng.addNode("A");\ng.addNode("B");\ng.addNode("C");\ng.addEdge("A", "B", 4);\ng.addEdge("B", "C", 2);\ng.bfs("A");`
  }
};

export const CodeExecutor: React.FC<CodeExecutorProps> = ({ structureType, onExecuteCommands }) => {
  const [language, setLanguage] = useState<'Python' | 'Java' | 'C++' | 'JavaScript'>('Python');
  const [code, setCode] = useState('');
  const activeLine = null;

  useEffect(() => {
    const defaultTemplates = TEMPLATES[structureType];
    if (defaultTemplates) {
      setCode(defaultTemplates[language] || '');
    } else {
      setCode('');
    }
  }, [structureType, language]);

  const handleRunCode = () => {
    const lines = code.split('\n');
    const parsedCommands: { action: string; params: any[] }[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

      // Match command patterns: e.g. stack.push(10) or arr.insert(0, 20)
      const commandRegex = /(arr|stack|q|list|tree|heap|hash|graph)\.(\w+)\(([^)]*)\)/;
      const match = trimmed.match(commandRegex);

      if (match) {
        const action = match[2];
        const paramsStr = match[3];
        const params = paramsStr.split(',').map(param => {
          const val = param.trim().replace(/['"]/g, '');
          const num = Number(val);
          return isNaN(num) ? val : num;
        }).filter(p => p !== '');

        parsedCommands.push({ action, params });
      }
    });

    if (parsedCommands.length > 0) {
      onExecuteCommands(parsedCommands);
    } else {
      alert("No valid data structure commands found! Example: stack.push(10)");
    }
  };

  return (
    <div className="code-editor-panel" style={{ marginTop: '20px' }}>
      <div className="code-header">
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Code Execution Engine</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            className="custom-select" 
            value={language} 
            onChange={(e: any) => setLanguage(e.target.value)}
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="JavaScript">JavaScript</option>
          </select>
          <button 
            className="control-btn" 
            onClick={handleRunCode}
            style={{ fontSize: '12px', padding: '4px 10px', background: 'var(--accent-indigo)' }}
          >
            <Play size={12} fill="white" /> Run
          </button>
        </div>
      </div>
      <div className="code-body">
        {code.split('\n').map((line, idx) => (
          <span 
            key={idx} 
            className={`code-line ${activeLine === idx + 1 ? 'active' : ''}`}
          >
            <span style={{ 
              position: 'absolute', 
              left: '0', 
              color: 'var(--text-muted)', 
              fontSize: '11px',
              width: '18px',
              textAlign: 'right'
            }}>{idx + 1}</span>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
};
