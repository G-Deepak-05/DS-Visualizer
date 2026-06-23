import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep, Annotation } from '../../types';
import { loadAnnotations, saveAnnotations } from '../../utils/annotations';
import { HelpOverlay } from '../HelpOverlay';

import { getAnalogy } from '../../utils/analogies';

interface TreeVisualizerProps {
  languageMode: 'technical' | 'analogy';
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ languageMode, onAddXP }) => {
  const [treeType, setTreeType] = useState<'bst' | 'avl'>('bst');
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Simulation steps
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  // Help overlay state
  const [showHelp, setShowHelp] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Load persisted annotations for this visualizer
  useEffect(() => {
    const saved = loadAnnotations('tree');
    setAnnotations(saved);
  }, []);

  const currentStep = steps[currentStepIndex] || {
    state: { tree: root, activeNodeVal: -1, successNodeVal: -1, rotationType: null },
    explanation: ""
  };

  // Initialize with some elements
  useEffect(() => {
    let newRoot: TreeNode | null = null;
    const initialValues = [50, 30, 70, 20, 40];
    initialValues.forEach(val => {
      newRoot = insertBSTNode(newRoot, val);
    });
    setRoot(newRoot);
    resetSteps(newRoot, "Initial binary search tree state.");
  }, [treeType]);

  const resetSteps = (node: TreeNode | null, explanation: string) => {
    setSteps([
      {
        stepNumber: 1,
        explanation,
        state: { tree: cloneTree(node), activeNodeVal: -1, successNodeVal: -1, rotationType: null }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // BST Insert
  const insertBSTNode = (node: TreeNode | null, val: number): TreeNode => {
    if (!node) {
      return { val, left: null, right: null, height: 1 };
    }
    if (val < node.val) {
      node.left = insertBSTNode(node.left, val);
    } else if (val > node.val) {
      node.right = insertBSTNode(node.right, val);
    }
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    return node;
  };

  // AVL Insert & Helper Rotation Functions
  const getHeight = (n: TreeNode | null): number => (n ? n.height : 0);
  const getBalance = (n: TreeNode | null): number => (n ? getHeight(n.left) - getHeight(n.right) : 0);

  const rotateRight = (y: TreeNode): TreeNode => {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    return x;
  };

  const rotateLeft = (x: TreeNode): TreeNode => {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    return y;
  };

  const insertAVL = (node: TreeNode | null, val: number, traceSteps: any[]): TreeNode => {
    if (!node) {
      traceSteps.push({
        explanation: `Create new node ${val} at the target empty slot.`,
        activeVal: val,
        successVal: val
      });
      return { val, left: null, right: null, height: 1 };
    }

    traceSteps.push({
      explanation: `Traverse Tree... Compare node ${node.val} with target value ${val}.`,
      activeVal: node.val
    });

    if (val < node.val) {
      node.left = insertAVL(node.left, val, traceSteps);
    } else if (val > node.val) {
      node.right = insertAVL(node.right, val, traceSteps);
    } else {
      return node; // Duplicate values not allowed in this BST/AVL
    }

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && val < node.left!.val) {
      traceSteps.push({
        explanation: `Imbalance detected at node ${node.val} (Balance factor: ${balance}). Performing Left-Left Single Right Rotation.`,
        activeVal: node.val,
        rotation: 'Right'
      });
      return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && val > node.right!.val) {
      traceSteps.push({
        explanation: `Imbalance detected at node ${node.val} (Balance factor: ${balance}). Performing Right-Right Single Left Rotation.`,
        activeVal: node.val,
        rotation: 'Left'
      });
      return rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && val > node.left!.val) {
      traceSteps.push({
        explanation: `Imbalance detected at node ${node.val}. Perform Left Rotation on left child ${node.left!.val}, then Right Rotation on parent.`,
        activeVal: node.val,
        rotation: 'Left-Right'
      });
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && val < node.right!.val) {
      traceSteps.push({
        explanation: `Imbalance detected at node ${node.val}. Perform Right Rotation on right child ${node.right!.val}, then Left Rotation on parent.`,
        activeVal: node.val,
        rotation: 'Right-Left'
      });
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  };

  const handleInsert = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Please specify a valid numeric value.");

    const traceSteps: any[] = [];
    let updatedRoot = cloneTree(root);

    if (treeType === 'bst') {
      // Trace search path
      const buildBSTTrace = (n: TreeNode | null, v: number) => {
        if (!n) {
          traceSteps.push({ explanation: `Locate insert position. Create new node ${v}.`, activeVal: v, successVal: v });
          return;
        }
        traceSteps.push({ explanation: `Traverse Tree... Compare ${n.val} with target value ${v}.`, activeVal: n.val });
        if (v < n.val) buildBSTTrace(n.left, v);
        else if (v > n.val) buildBSTTrace(n.right, v);
      };

      buildBSTTrace(updatedRoot, val);
      updatedRoot = insertBSTNode(updatedRoot, val);
    } else {
      // AVL Insertion with rotations tracing
      updatedRoot = insertAVL(updatedRoot, val, traceSteps);
    }

    // Convert traceSteps to VisualizerSteps
    const newSteps: VisualizerStep[] = traceSteps.map((step, idx) => ({
      stepNumber: idx + 1,
      explanation: step.explanation,
      state: { 
        tree: updatedRoot, // showing the final structure or we can snapshot it, for ease of display we draw final
        activeNodeVal: step.activeVal,
        successNodeVal: step.successVal || -1,
        rotationType: step.rotation || null
      }
    }));

    setSteps(newSteps);
    setRoot(updatedRoot);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, `Insert ${val} to ${treeType.toUpperCase()}`, 'visualization');
  };

  // Traversal animations
  const runTraversal = (mode: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => {
    if (!root) return alert("Tree is empty!");
    const traversalOrder: number[] = [];

    // Helper functions
    const inorder = (n: TreeNode | null) => {
      if (!n) return;
      inorder(n.left);
      traversalOrder.push(n.val);
      inorder(n.right);
    };

    const preorder = (n: TreeNode | null) => {
      if (!n) return;
      traversalOrder.push(n.val);
      preorder(n.left);
      preorder(n.right);
    };

    const postorder = (n: TreeNode | null) => {
      if (!n) return;
      postorder(n.left);
      postorder(n.right);
      traversalOrder.push(n.val);
    };

    const levelorder = (n: TreeNode | null) => {
      if (!n) return;
      const q: TreeNode[] = [n];
      while (q.length > 0) {
        const curr = q.shift()!;
        traversalOrder.push(curr.val);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
    };

    if (mode === 'inorder') inorder(root);
    else if (mode === 'preorder') preorder(root);
    else if (mode === 'postorder') postorder(root);
    else if (mode === 'levelorder') levelorder(root);

    // Build visualization trace step by step
    const newSteps: VisualizerStep[] = [];
    const traversedList: number[] = [];

    traversalOrder.forEach((val, idx) => {
      traversedList.push(val);
      newSteps.push({
        stepNumber: idx + 1,
        explanation: `Visit node ${val}. Add to traversal list: [${traversedList.join(', ')}].`,
        state: { 
          tree: cloneTree(root),
          activeNodeVal: val,
          successNodeVal: -1,
          traversedList: [...traversedList]
        }
      });
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(25, `${mode.toUpperCase()} Tree Traversal`, 'visualization');
  };

  const handleSearch = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Enter target value to search.");

    const newSteps: VisualizerStep[] = [];
    let curr = root;
    let found = false;

    while (curr) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Compare node ${curr.val} with search key ${val}.`,
        state: { tree: cloneTree(root), activeNodeVal: curr.val, successNodeVal: -1 }
      });

      if (val === curr.val) {
        found = true;
        break;
      } else if (val < curr.val) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    if (found && curr) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Value ${val} found successfully in the tree!`,
        state: { tree: cloneTree(root), activeNodeVal: -1, successNodeVal: val }
      });
    } else {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Value ${val} not found in binary search tree path.`,
        state: { tree: cloneTree(root), activeNodeVal: -1, successNodeVal: -1 }
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, `Search Tree for ${val}`, 'visualization');
  };

  // Node drawing coordinate calculators
  interface NodeLayout {
    id: number;
    val: number;
    x: number;
    y: number;
    parentX: number | null;
    parentY: number | null;
  }

  const computeLayout = (
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number,
    pX: number | null,
    pY: number | null,
    list: NodeLayout[]
  ) => {
    if (!node) return;
    list.push({ id: node.val, val: node.val, x, y, parentX: pX, parentY: pY });
    
    // Left child
    computeLayout(node.left, x - offset, y + 60, offset * 0.5, x, y, list);
    // Right child
    computeLayout(node.right, x + offset, y + 60, offset * 0.5, x, y, list);
  };

  const layoutNodes: NodeLayout[] = [];
  const activeTree = currentStep.state.tree;
  computeLayout(activeTree, 200, 40, 85, null, null, layoutNodes);

  // Helper cloning & utility
  function cloneTree(node: TreeNode | null): TreeNode | null {
    if (!node) return null;
    return {
      val: node.val,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
      height: node.height
    };
  }

  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    let tempRoot = cloneTree(root);
    const generatedSteps: VisualizerStep[] = [];
    let currentStepNumber = 1;

    commands.forEach((cmd) => {
      const { action, params } = cmd;
      if (action === 'insert') {
        const val = Number(params[0]);
        if (!isNaN(val)) {
          tempRoot = insertBSTNode(tempRoot, val);
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: Insert Node ${val}.`,
            state: { tree: cloneTree(tempRoot), activeNodeVal: -1, successNodeVal: val }
          });
        }
      }
    });

    if (generatedSteps.length > 0) {
      setRoot(tempRoot);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(25, 'Run Custom Tree Script', 'visualization');
    }
  };

  const currentExplanation = languageMode === 'analogy' 
    ? getAnalogy('tree', currentStep.explanation) 
    : currentStep.explanation;

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Binary Tree Visualizer</h2>
              <div className="tab-group" style={{ width: '200px' }}>
                <button className={`tab-btn ${treeType === 'bst' ? 'active' : ''}`} onClick={() => setTreeType('bst')}>BST</button>
                <button className={`tab-btn ${treeType === 'avl' ? 'active' : ''}`} onClick={() => setTreeType('avl')}>AVL Tree</button>
              </div>
            </div>

            {/* Tree Canvas Container */}
            <div className="visualizer-canvas-container" style={{ display: 'flex', flexDirection: 'column', padding: '0', alignItems: 'stretch', minHeight: '300px' }}>
              
              {/* Canvas Header / Speedometer & Invariant Counters */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>Active: <strong style={{ color: 'var(--accent-amber)' }}>{currentStep.state.activeNodeVal !== -1 ? currentStep.state.activeNodeVal : 'None'}</strong></span>
                  <span>Tree Nodes: <strong style={{ color: 'var(--accent-cyan)' }}>{layoutNodes.length}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Balance/Depth:</span>
                  <div style={{
                    width: '60px',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${layoutNodes.length > 0 ? Math.min(100, (Math.log2(layoutNodes.length + 1) / 4) * 100) : 0}%`,
                      height: '100%',
                      background: 'var(--accent-cyan)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* Main Canvas Area */}
              <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '280px' }}>
                <svg style={{ width: '100%', height: '100%', minHeight: '280px', position: 'absolute', top: 0, left: 0 }}>
                  {/* Draw connection lines */}
                  {layoutNodes.map((node) => {
                    if (node.parentX === null || node.parentY === null) return null;
                    return (
                      <line
                        key={`line-${node.val}`}
                        x1={node.parentX}
                        y1={node.parentY}
                        x2={node.x}
                        y2={node.y}
                        style={{ stroke: 'rgba(255, 255, 255, 0.12)', strokeWidth: 2 }}
                      />
                    );
                  })}
                </svg>

                {/* Render Nodes as absolute divs */}
                {layoutNodes.map((node) => {
                  const isActive = currentStep.state.activeNodeVal === node.val;
                  const isSuccess = currentStep.state.successNodeVal === node.val;

                  let nodeClass = "ds-node";
                  if (isActive) nodeClass += " active";
                  if (isSuccess) nodeClass += " success";

                  return (
                    <div
                      key={`node-${node.val}`}
                      className={nodeClass}
                      style={{
                        position: 'absolute',
                        left: `${node.x - 22}px`,
                        top: `${node.y - 22}px`,
                        width: '44px',
                        height: '44px',
                        fontSize: '13px',
                        borderRadius: '50%'
                      }}
                    >
                      {node.val}
                    </div>
                  );
                })}

                {layoutNodes.length === 0 && (
                  <div style={{ position: 'absolute', top: '45%', left: '42%', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Tree is Empty
                  </div>
                )}
              </div>
            </div>

            {/* Traversal display helper */}
            {currentStep.state.traversedList && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)'
              }}>
                <span style={{ color: 'var(--accent-cyan)' }}>Traversal Order: </span>
                {currentStep.state.traversedList.join(' → ')}
              </div>
            )}
          </div>

          <PlaybackControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onNext={() => setCurrentStepIndex(p => Math.min(steps.length - 1, p + 1))}
            onPrev={() => setCurrentStepIndex(p => Math.max(0, p - 1))}
            onReset={() => setCurrentStepIndex(0)}
            speed={speed}
            setSpeed={setSpeed}
            explanation={currentExplanation}
          />
          {/* Help overlay toggle button */}
          <button
            className="control-btn"
            style={{ marginTop: '8px' }}
            onClick={() => setShowHelp(prev => !prev)}
          >
            {showHelp ? 'Close Help' : 'Help'}
          </button>
          {showHelp && (
            <HelpOverlay
              annotations={annotations}
              onChange={newAnn => {
                setAnnotations(newAnn);
                saveAnnotations('tree', newAnn);
              }}
              onClose={() => setShowHelp(false)}
            />
          )}
        </div>

        <CodeExecutor structureType="tree" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="number" 
              placeholder="Node Value" 
              className="custom-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{ fontSize: '13px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="control-btn" onClick={() => handleInsert()}>Insert</button>
              <button className="control-btn" onClick={() => handleSearch()}>Search</button>
            </div>

            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '4px 0' }} />
            
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TRAVERSALS</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button className="control-btn" onClick={() => runTraversal('inorder')} style={{ fontSize: '12px' }}>Inorder</button>
              <button className="control-btn" onClick={() => runTraversal('preorder')} style={{ fontSize: '12px' }}>Preorder</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button className="control-btn" onClick={() => runTraversal('postorder')} style={{ fontSize: '12px' }}>Postorder</button>
              <button className="control-btn" onClick={() => runTraversal('levelorder')} style={{ fontSize: '12px' }}>Level Order</button>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="tree" />
        </div>
      </div>
    </div>
  );
};
