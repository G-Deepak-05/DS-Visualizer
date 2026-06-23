import React, { useState, useEffect } from 'react';
import { Play, Code, LayoutGrid } from 'lucide-react';
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
    Python: `hash.insert(10)\nhash.insert(20)\nhash.insert(15)\nhash.search(15)`,
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

const BLOCKS_CONFIG: Record<string, { label: string; action: string; params: { label: string; type: 'number' | 'string' }[] }[]> = {
  array: [
    { label: 'Insert Element', action: 'insert', params: [{ label: 'Index', type: 'number' }, { label: 'Value', type: 'number' }] },
    { label: 'Update Element', action: 'update', params: [{ label: 'Index', type: 'number' }, { label: 'Value', type: 'number' }] },
    { label: 'Delete Element', action: 'delete', params: [{ label: 'Index', type: 'number' }] }
  ],
  'linked-list': [
    { label: 'Insert Head', action: 'insertHead', params: [{ label: 'Value', type: 'number' }] },
    { label: 'Insert Tail', action: 'insertTail', params: [{ label: 'Value', type: 'number' }] },
    { label: 'Reverse List', action: 'reverse', params: [] }
  ],
  stack: [
    { label: 'Push Value', action: 'push', params: [{ label: 'Value', type: 'number' }] },
    { label: 'Pop Value', action: 'pop', params: [] }
  ],
  queue: [
    { label: 'Enqueue Value', action: 'enqueue', params: [{ label: 'Value', type: 'number' }] },
    { label: 'Dequeue Value', action: 'dequeue', params: [] }
  ],
  tree: [
    { label: 'Insert Node', action: 'insert', params: [{ label: 'Value', type: 'number' }] },
    { label: 'Search Node', action: 'search', params: [{ label: 'Value', type: 'number' }] }
  ],
  heap: [
    { label: 'Insert Value', action: 'insert', params: [{ label: 'Value', type: 'number' }] },
    { label: 'Delete Min/Max', action: 'delete', params: [] }
  ],
  'hash-table': [
    { label: 'Insert Value', action: 'insert', params: [{ label: 'Value', type: 'number' }] },
    { label: 'Search Value', action: 'search', params: [{ label: 'Value', type: 'number' }] }
  ],
  graph: [
    { label: 'Add Node', action: 'addNode', params: [{ label: 'Name', type: 'string' }] },
    { label: 'Add Edge', action: 'addEdge', params: [{ label: 'From', type: 'string' }, { label: 'To', type: 'string' }, { label: 'Weight', type: 'number' }] },
    { label: 'Run BFS', action: 'bfs', params: [{ label: 'Start Node', type: 'string' }] }
  ]
};

const PREFIX_MAP: Record<string, string> = {
  array: 'arr',
  'linked-list': 'list',
  stack: 'stack',
  queue: 'q',
  tree: 'tree',
  heap: 'heap',
  'hash-table': 'hash',
  graph: 'graph'
};

interface BlockItem {
  id: string;
  rawText: string;
  isValid: boolean;
  prefix?: string;
  action?: string;
  params?: any[];
}

export const CodeExecutor: React.FC<CodeExecutorProps> = ({ structureType, onExecuteCommands }) => {
  const [language, setLanguage] = useState<'Python' | 'Java' | 'C++' | 'JavaScript'>('Python');
  const [code, setCode] = useState('');
  const [viewMode, setViewMode] = useState<'editor' | 'blocks'>('editor');

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

  const addBlockToCode = (action: string, params: any[]) => {
    const prefix = PREFIX_MAP[structureType] || 'struct';
    const paramString = params.map(p => typeof p === 'string' ? `"${p}"` : p).join(', ');
    const newLine = `${prefix}.${action}(${paramString})`;
    setCode(prev => prev ? `${prev}\n${newLine}` : newLine);
  };

  const parseCodeToBlocks = (codeString: string): BlockItem[] => {
    const lines = codeString.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      const commandRegex = /(arr|stack|q|list|tree|heap|hash|graph)\.(\w+)\(([^)]*)\)/;
      const match = trimmed.match(commandRegex);
      if (match) {
        const prefix = match[1];
        const action = match[2];
        const paramsStr = match[3];
        const params = paramsStr.split(',').map(p => {
          const val = p.trim().replace(/['"]/g, '');
          const num = Number(val);
          return isNaN(num) ? val : num;
        }).filter(p => p !== '');
        return {
          id: `${idx}-${trimmed}`,
          rawText: line,
          isValid: true,
          prefix,
          action,
          params
        };
      } else {
        return {
          id: `${idx}-${trimmed}`,
          rawText: line,
          isValid: false
        };
      }
    }).filter(item => item.rawText.trim().length > 0);
  };

  const blockItems = parseCodeToBlocks(code);
  const blocksConfig = BLOCKS_CONFIG[structureType] || [];

  return (
    <div className="code-editor-panel" style={{ marginTop: '20px' }}>
      <div className="code-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '2px', borderRadius: '6px' }}>
          <button
            onClick={() => setViewMode('editor')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: viewMode === 'editor' ? 'var(--bg-tertiary)' : 'transparent',
              color: viewMode === 'editor' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '11px',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <Code size={12} /> Editor
          </button>
          <button
            onClick={() => setViewMode('blocks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: viewMode === 'blocks' ? 'var(--bg-tertiary)' : 'transparent',
              color: viewMode === 'blocks' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '11px',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <LayoutGrid size={12} /> Blocks
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {viewMode === 'editor' && (
            <select 
              className="custom-select" 
              value={language} 
              onChange={(e: any) => setLanguage(e.target.value)}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="JavaScript">JavaScript</option>
            </select>
          )}
          <button 
            className="control-btn" 
            onClick={handleRunCode}
            style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--accent-indigo)' }}
          >
            <Play size={12} fill="white" /> Run Script
          </button>
        </div>
      </div>

      <div className="code-body" style={{ padding: '0', background: '#090d16' }}>
        {viewMode === 'editor' ? (
          <div style={{ display: 'flex', minHeight: '220px' }}>
            {/* Simple Line Numbers */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              padding: '16px 8px 16px 12px',
              borderRight: '1px solid rgba(255,255,255,0.03)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.6',
              textAlign: 'right',
              userSelect: 'none',
              minWidth: '32px'
            }}>
              {(code.split('\n').length || 1) === 0 ? 1 : code.split('\n').map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Write commands here..."
              spellCheck={false}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#e6edf3',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                padding: '16px',
                minHeight: '220px'
              }}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', minHeight: '220px' }}>
            {/* Blocks Selector */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '16px', maxHeight: '250px', overflowY: 'auto' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>Available Blocks</div>
              {blocksConfig.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No blocks configured for this view.</div>
              ) : (
                blocksConfig.map((config, idx) => (
                  <BlockCreatorItem key={idx} config={config} onAdd={(params) => addBlockToCode(config.action, params)} />
                ))
              )}
            </div>

            {/* Blocks Sequence */}
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Sequence</span>
                {code.trim().length > 0 && (
                  <button 
                    onClick={() => setCode('')} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', fontSize: '10px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Clear All
                  </button>
                )}
              </div>
              {blockItems.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Click + Add on left to append blocks
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {blockItems.map((item, idx) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: item.isValid ? 'rgba(99, 102, 241, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                      border: item.isValid ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid rgba(244, 63, 94, 0.15)',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}>
                      <div>
                        {item.isValid ? (
                          <span>
                            <strong style={{ color: 'var(--accent-cyan)' }}>{item.action}</strong>
                            {item.params && item.params.length > 0 && `( ${item.params.join(', ')} )`}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{item.rawText}</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const lines = code.split('\n');
                          lines.splice(idx, 1);
                          setCode(lines.join('\n'));
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-rose)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '0 4px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BlockCreatorItem: React.FC<{ config: any; onAdd: (params: any[]) => void }> = ({ config, onAdd }) => {
  const [inputs, setInputs] = useState<string[]>(config.params.map(() => ''));

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '10px 12px',
      marginBottom: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{config.label}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        {config.params.map((p: any, idx: number) => (
          <input
            key={idx}
            type={p.type === 'number' ? 'number' : 'text'}
            placeholder={p.label}
            value={inputs[idx]}
            onChange={(e) => {
              const copy = [...inputs];
              copy[idx] = e.target.value;
              setInputs(copy);
            }}
            style={{
              flex: 1,
              minWidth: '50px',
              padding: '4px 6px',
              fontSize: '11px',
              borderRadius: '4px',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        ))}
        <button
          onClick={() => {
            const finalParams = config.params.map((p: any, idx: number) => {
              const val = inputs[idx];
              if (val.trim() === '') return p.type === 'number' ? 0 : '';
              return p.type === 'number' ? Number(val) : String(val);
            });
            onAdd(finalParams);
            setInputs(config.params.map(() => ''));
          }}
          style={{
            padding: '3px 8px',
            fontSize: '10px',
            fontWeight: 600,
            background: 'var(--accent-indigo)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Add
        </button>
      </div>
    </div>
  );
};
