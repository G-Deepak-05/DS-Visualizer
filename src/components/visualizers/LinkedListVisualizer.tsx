import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep } from '../../types';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';

interface LinkedListVisualizerProps {
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ onAddXP }) => {
  const [listType, setListType] = useState<'singly' | 'doubly' | 'circular'>('singly');
  const [nodes, setNodes] = useState<number[]>([15, 25, 35]);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');

  // Player controls
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(850);

  useEffect(() => {
    resetSteps([15, 25, 35], "Initial linked list structure.");
  }, [listType]);

  const resetSteps = (initialNodes: number[], explanation: string) => {
    setSteps([
      {
        stepNumber: 1,
        explanation,
        state: { nodes: [...initialNodes], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1, isReversing: false }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Insert Head
  const handleInsertHead = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Please specify a valid value.");

    const newSteps: VisualizerStep[] = [];
    const currentNodes = [...nodes];

    // Step 1: Node creation
    newSteps.push({
      stepNumber: 1,
      explanation: `Create a new Node with value ${val}. Allocate memory dynamically.`,
      state: { nodes: [...currentNodes], activeIdx: -1, compareIdx: -1, insertAt: 0, newNodeVal: val, successIdx: -1 }
    });

    // Step 2: Set pointer
    newSteps.push({
      stepNumber: 2,
      explanation: `Point the 'next' pointer of new Node to current Head (value: ${currentNodes[0] || 'NULL'}).`,
      state: { nodes: [...currentNodes], activeIdx: -1, compareIdx: -1, insertAt: 0, newNodeVal: val, pointingToHead: true, successIdx: -1 }
    });

    // Step 3: Shift Head pointer
    const updated = [val, ...currentNodes];
    newSteps.push({
      stepNumber: 3,
      explanation: `Update the Head pointer to refer to the new Node.`,
      state: { nodes: updated, activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: 0 }
    });

    setSteps(newSteps);
    setNodes(updated);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Insert ${val} at LL Head`, 'visualization');
  };

  // Insert Tail
  const handleInsertTail = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Please specify a valid value.");

    const newSteps: VisualizerStep[] = [];
    const currentNodes = [...nodes];

    // Step 1: Traverse to tail
    for (let i = 0; i < currentNodes.length; i++) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Traversing list... Current Node index ${i} (value: ${currentNodes[i]}).`,
        state: { nodes: [...currentNodes], activeIdx: i, compareIdx: -1, insertAt: -1, successIdx: -1 }
      });
    }

    // Step 2: Create new node
    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Create new node ${val}. Set its next pointer to ${listType === 'circular' ? 'Head' : 'NULL'}.`,
      state: { nodes: [...currentNodes], activeIdx: -1, compareIdx: -1, insertAt: currentNodes.length, newNodeVal: val, successIdx: -1 }
    });

    // Step 3: Link tail node
    const updated = [...currentNodes, val];
    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Point the last node's pointer to the newly created node.`,
      state: { nodes: updated, activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: updated.length - 1 }
    });

    setSteps(newSteps);
    setNodes(updated);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Insert ${val} at LL Tail`, 'visualization');
  };

  // Insert at Position
  const handleInsertAtPosition = () => {
    const val = Number(inputValue);
    const pos = Number(inputIndex);
    if (isNaN(val) || isNaN(pos)) return alert("Specify index and value.");
    if (pos < 0 || pos > nodes.length) return alert(`Index out of bounds! Range: 0 to ${nodes.length}`);

    if (pos === 0) return handleInsertHead(val);
    if (pos === nodes.length) return handleInsertTail(val);

    const newSteps: VisualizerStep[] = [];
    const currentNodes = [...nodes];

    // Step 1: Traverse to pos - 1
    for (let i = 0; i < pos; i++) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Traverse to index ${i}. Finding node before target position ${pos}.`,
        state: { nodes: [...currentNodes], activeIdx: i, compareIdx: -1, insertAt: -1, successIdx: -1 }
      });
    }

    // Step 2: Create node & link next
    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Create node ${val}. Point its next pointer to index ${pos} node (value: ${currentNodes[pos]}).`,
      state: { nodes: [...currentNodes], activeIdx: -1, compareIdx: -1, insertAt: pos, newNodeVal: val, successIdx: -1 }
    });

    // Step 3: Point preceding node
    const updated = [...currentNodes];
    updated.splice(pos, 0, val);
    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Point index ${pos - 1} node's pointer to the new Node.`,
      state: { nodes: updated, activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: pos }
    });

    setSteps(newSteps);
    setNodes(updated);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, `Insert ${val} at Position ${pos}`, 'visualization');
  };

  // Delete Node
  const handleDeleteNode = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Enter value of node to delete.");

    const newSteps: VisualizerStep[] = [];
    let deleteIdx = nodes.indexOf(val);

    if (deleteIdx === -1) {
      alert(`Value ${val} not found in the list!`);
      return;
    }

    // Traverse to search target
    for (let i = 0; i <= deleteIdx; i++) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Searching for node to delete... Currently checking node at index ${i} (value: ${nodes[i]}).`,
        state: { nodes: [...nodes], activeIdx: i, compareIdx: -1, insertAt: -1, successIdx: -1 }
      });
    }

    const currentNodes = [...nodes];
    
    if (deleteIdx === 0) {
      currentNodes.splice(0, 1);
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Head node deleted. Move the Head pointer to the next node (value: ${currentNodes[0] || 'NULL'}).`,
        state: { nodes: currentNodes, activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 }
      });
    } else {
      currentNodes.splice(deleteIdx, 1);
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Link the preceding node at index ${deleteIdx - 1} to point directly to node at index ${deleteIdx + 1} (value: ${currentNodes[deleteIdx] || 'NULL'}), skipping target node.`,
        state: { nodes: currentNodes, activeIdx: deleteIdx - 1, compareIdx: -1, insertAt: -1, successIdx: -1 }
      });
    }

    setSteps(newSteps);
    setNodes(currentNodes);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Delete Node ${val} from LL`, 'visualization');
  };

  // Search Node
  const handleSearchNode = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return alert("Please specify search target.");

    const newSteps: VisualizerStep[] = [];
    let foundIdx = -1;

    for (let i = 0; i < nodes.length; i++) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Compare node value ${nodes[i]} with target ${val}.`,
        state: { nodes: [...nodes], activeIdx: -1, compareIdx: i, insertAt: -1, successIdx: -1 }
      });

      if (nodes[i] === val) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== -1) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Successfully found node ${val} at index ${foundIdx}!`,
        state: { nodes: [...nodes], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: foundIdx }
      });
    } else {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Value ${val} not found in linked list traversal.`,
        state: { nodes: [...nodes], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 }
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Search LL for Node ${val}`, 'visualization');
  };

  // Reverse List
  const handleReverseList = () => {
    if (nodes.length <= 1) return alert("Requires at least 2 nodes to reverse.");

    const newSteps: VisualizerStep[] = [];
    const currentNodes = [...nodes];
    
    newSteps.push({
      stepNumber: 1,
      explanation: `Initialize reversal pointers: prev = NULL, curr = Head, next = NULL.`,
      state: { nodes: [...currentNodes], activeIdx: 0, prevIdx: -1, isReversing: true }
    });

    const reversed: number[] = [];
    // Trace through reversal step by step visually
    for (let i = 0; i < currentNodes.length; i++) {
      reversed.unshift(currentNodes[i]);
      newSteps.push({
        stepNumber: i + 2,
        explanation: `Step ${i + 1}: Reverse node ${currentNodes[i]}'s pointer to point to predecessor. Advance pointers.`,
        // Create intermediate reversed displays
        state: { 
          nodes: [...reversed, ...currentNodes.slice(i + 1)], 
          activeIdx: i + 1, 
          prevIdx: i, 
          isReversing: true 
        }
      });
    }

    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Reversal complete. Update Head pointer to refer to node ${reversed[0]}.`,
      state: { nodes: reversed, activeIdx: -1, prevIdx: -1, isReversing: false, successIdx: 0 }
    });

    setSteps(newSteps);
    setNodes(reversed);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(25, `Reverse ${listType.toUpperCase()} Linked List`, 'visualization');
  };

  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    let tempNodes = [...nodes];
    const generatedSteps: VisualizerStep[] = [];
    let currentStepNumber = 1;

    commands.forEach((cmd) => {
      const { action, params } = cmd;
      if (action === 'insertHead') {
        const val = Number(params[0]);
        if (!isNaN(val)) {
          tempNodes.unshift(val);
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: Insert Head (${val}).`,
            state: { nodes: [...tempNodes], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: 0 }
          });
        }
      } else if (action === 'insertTail') {
        const val = Number(params[0]);
        if (!isNaN(val)) {
          tempNodes.push(val);
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: Insert Tail (${val}).`,
            state: { nodes: [...tempNodes], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: tempNodes.length - 1 }
          });
        }
      } else if (action === 'deleteNode') {
        const val = Number(params[0]);
        const idx = tempNodes.indexOf(val);
        if (idx !== -1) {
          tempNodes.splice(idx, 1);
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: Delete Node (${val}).`,
            state: { nodes: [...tempNodes], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 }
          });
        }
      } else if (action === 'reverse') {
        tempNodes.reverse();
        generatedSteps.push({
          stepNumber: currentStepNumber++,
          explanation: "Code run: Reverse List.",
          state: { nodes: [...tempNodes], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: 0 }
        });
      }
    });

    if (generatedSteps.length > 0) {
      setNodes(tempNodes);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(25, 'Run Custom Linked List Script', 'visualization');
    }
  };

  const currentStep = steps[currentStepIndex] || {
    state: { nodes, activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 },
    explanation: ""
  };
  const activeNodes = currentStep.state.nodes;

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Linked List Visualizer</h2>
              <div className="tab-group" style={{ width: '260px' }}>
                <button className={`tab-btn ${listType === 'singly' ? 'active' : ''}`} onClick={() => setListType('singly')}>Singly</button>
                <button className={`tab-btn ${listType === 'doubly' ? 'active' : ''}`} onClick={() => setListType('doubly')}>Doubly</button>
                <button className={`tab-btn ${listType === 'circular' ? 'active' : ''}`} onClick={() => setListType('circular')}>Circular</button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="visualizer-canvas-container" style={{ overflowX: 'auto', justifyContent: 'flex-start', padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* HEAD Pointer */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--accent-indigo)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                  Head
                </div>
                <ArrowRight size={16} className="list-arrow active" />

                {/* Nodes rendering */}
                {activeNodes.map((val: number, idx: number) => {
                  const isActive = currentStep.state.activeIdx === idx;
                  const isCompare = currentStep.state.compareIdx === idx;
                  const isSuccess = currentStep.state.successIdx === idx;

                  let nodeClass = "ds-node";
                  if (isActive) nodeClass += " active";
                  if (isCompare) nodeClass += " compare";
                  if (isSuccess) nodeClass += " success";

                  return (
                    <React.Fragment key={idx}>
                      <div className={nodeClass} style={{ flexShrink: 0 }}>
                        {val}
                      </div>

                      {/* Connector Arrow */}
                      {idx < activeNodes.length - 1 && (
                        <div className="list-arrow" style={{ flexShrink: 0, padding: '0 4px' }}>
                          {listType === 'doubly' ? (
                            <ArrowLeftRight size={18} style={{ color: 'var(--accent-indigo)' }} />
                          ) : (
                            <ArrowRight size={16} />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* TAIL Pointer */}
                <ArrowRight size={16} className="list-arrow" />
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {listType === 'circular' ? 'Head (Loop)' : 'NULL'}
                </div>
              </div>
            </div>
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
            explanation={currentStep.explanation}
          />
        </div>

        <CodeExecutor structureType="linked-list" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="Index (Optional)" 
                className="custom-input"
                value={inputIndex}
                onChange={e => setInputIndex(e.target.value)}
                style={{ fontSize: '13px' }}
              />
              <input 
                type="number" 
                placeholder="Value" 
                className="custom-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                style={{ fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="control-btn" onClick={() => handleInsertHead()}>Insert Head</button>
              <button className="control-btn" onClick={() => handleInsertTail()}>Insert Tail</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="control-btn" onClick={handleInsertAtPosition}>Insert Pos</button>
              <button className="control-btn" onClick={() => handleDeleteNode()}>Delete Node</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="control-btn" onClick={handleSearchNode}>Search</button>
              <button className="control-btn active" onClick={handleReverseList}>Reverse List</button>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="linked-list" />
        </div>
      </div>
    </div>
  );
};
