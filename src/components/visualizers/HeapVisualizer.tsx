import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep } from '../../types';
import { getAnalogy } from '../../utils/analogies';

interface HeapVisualizerProps {
  languageMode: 'technical' | 'analogy';
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ languageMode, onAddXP }) => {
  const [heapType, setHeapType] = useState<'min' | 'max'>('min');
  const [heap, setHeap] = useState<number[]>([10, 25, 30, 45, 50]);
  const [inputValue, setInputValue] = useState('');

  // Simulation steps
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(850);

  useEffect(() => {
    const initHeap = heapType === 'min' ? [10, 25, 30, 45, 50] : [50, 45, 30, 25, 10];
    setHeap(initHeap);
    setSteps([
      {
        stepNumber: 1,
        explanation: `Initial ${heapType.toUpperCase()} Heap state. Synchronized Tree and Array mapping shown.`,
        state: { heap: [...initHeap], active: -1, compare: -1, success: -1 }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [heapType]);

  // Bubble up animation helper
  const handleInsert = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Specify value to insert.");
    if (heap.length >= 7) return alert("Heap visualization limited to max size 7.");

    const newSteps: VisualizerStep[] = [];
    const tempHeap = [...heap, val];
    let i = tempHeap.length - 1;

    // Step 1: Append node
    newSteps.push({
      stepNumber: 1,
      explanation: `Insert node ${val} at the end of the heap array (index ${i}).`,
      state: { heap: [...tempHeap], active: i, compare: -1, success: -1 }
    });

    // Bubble up swaps tracing
    while (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      const isSwapNeeded = heapType === 'min' 
        ? tempHeap[i] < tempHeap[parentIdx]
        : tempHeap[i] > tempHeap[parentIdx];

      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Compare node ${tempHeap[i]} at index ${i} with parent ${tempHeap[parentIdx]} at index ${parentIdx}.`,
        state: { heap: [...tempHeap], active: i, compare: parentIdx, success: -1 }
      });

      if (isSwapNeeded) {
        // Swap
        const tempVal = tempHeap[i];
        tempHeap[i] = tempHeap[parentIdx];
        tempHeap[parentIdx] = tempVal;

        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Swap index ${i} with parent index ${parentIdx} to maintain heap invariant.`,
          state: { heap: [...tempHeap], active: parentIdx, compare: i, success: -1 }
        });
        i = parentIdx;
      } else {
        break;
      }
    }

    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Insertion complete. Heap structure is fully balanced.`,
      state: { heap: [...tempHeap], active: -1, compare: -1, success: i }
    });

    setHeap(tempHeap);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, `Insert ${val} to Heap`, 'visualization');
  };

  // Delete root element
  const handleDelete = () => {
    if (heap.length === 0) return alert("Heap is empty!");

    const newSteps: VisualizerStep[] = [];
    const tempHeap = [...heap];
    const removedRoot = tempHeap[0];

    if (tempHeap.length === 1) {
      tempHeap.pop();
      newSteps.push({
        stepNumber: 1,
        explanation: `Remove only node ${removedRoot} from heap. Heap is now empty.`,
        state: { heap: [], active: -1, compare: -1, success: -1 }
      });
      setHeap([]);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      return;
    }

    // Replace root with last
    const lastNode = tempHeap.pop()!;
    tempHeap[0] = lastNode;

    newSteps.push({
      stepNumber: 1,
      explanation: `Remove root element (${removedRoot}). Move last element (${lastNode}) from index ${tempHeap.length} to root (index 0).`,
      state: { heap: [...tempHeap], active: 0, compare: -1, success: -1 }
    });

    // Heapify-down
    let i = 0;
    const len = tempHeap.length;

    while (2 * i + 1 < len) {
      let swapIdx = 2 * i + 1; // left child
      const rightIdx = 2 * i + 2;

      // Compare left/right child
      if (rightIdx < len) {
        const priorityRight = heapType === 'min'
          ? tempHeap[rightIdx] < tempHeap[swapIdx]
          : tempHeap[rightIdx] > tempHeap[swapIdx];

        if (priorityRight) {
          swapIdx = rightIdx;
        }
      }

      const isSwapNeeded = heapType === 'min'
        ? tempHeap[swapIdx] < tempHeap[i]
        : tempHeap[swapIdx] > tempHeap[i];

      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Compare node ${tempHeap[i]} at index ${i} with child ${tempHeap[swapIdx]} at index ${swapIdx}.`,
        state: { heap: [...tempHeap], active: i, compare: swapIdx, success: -1 }
      });

      if (isSwapNeeded) {
        const temp = tempHeap[i];
        tempHeap[i] = tempHeap[swapIdx];
        tempHeap[swapIdx] = temp;

        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Swap index ${i} with child index ${swapIdx} to maintain heap invariant.`,
          state: { heap: [...tempHeap], active: swapIdx, compare: i, success: -1 }
        });
        i = swapIdx;
      } else {
        break;
      }
    }

    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Deletion and heapify-down complete.`,
      state: { heap: [...tempHeap], active: -1, compare: -1, success: i }
    });

    setHeap(tempHeap);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, `Delete ${heapType === 'min' ? 'Min' : 'Max'} Heap Root`, 'visualization');
  };

  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    let tempHeap = [...heap];
    const generatedSteps: VisualizerStep[] = [];
    let currentStepNumber = 1;

    commands.forEach((cmd) => {
      const { action, params } = cmd;
      if (action === 'insert' && tempHeap.length < 7) {
        const val = Number(params[0]);
        if (!isNaN(val)) {
          // Perform basic insert logic
          tempHeap.push(val);
          // Run Min Heap bubbleUp sorting simplified
          let i = tempHeap.length - 1;
          while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if ((heapType === 'min' && tempHeap[i] < tempHeap[p]) || (heapType === 'max' && tempHeap[i] > tempHeap[p])) {
              const tmp = tempHeap[i];
              tempHeap[i] = tempHeap[p];
              tempHeap[p] = tmp;
              i = p;
            } else break;
          }
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: Insert Heap Node ${val}.`,
            state: { heap: [...tempHeap], active: -1, compare: -1, success: i }
          });
        }
      } else if (action === 'delete') {
        if (tempHeap.length > 0) {
          tempHeap.shift(); // simplified delete
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: "Code run: Delete root.",
            state: { heap: [...tempHeap], active: -1, compare: -1, success: -1 }
          });
        }
      }
    });

    if (generatedSteps.length > 0) {
      setHeap(tempHeap);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(25, 'Run Custom Heap Script', 'visualization');
    }
  };

  const currentStep = steps[currentStepIndex] || {
    state: { heap, active: -1, compare: -1, success: -1 },
    explanation: ""
  };
  const activeHeap = currentStep.state.heap;

  const currentExplanation = languageMode === 'analogy' 
    ? getAnalogy('heap', currentStep.explanation) 
    : currentStep.explanation;

  // Compute Layout positions for tree nodes (indexed 0 to 6)
  interface NodeCoord {
    val: number;
    x: number;
    y: number;
    parentIdx: number | null;
  }

  const getCoordinates = (idx: number): NodeCoord | null => {
    if (idx >= activeHeap.length) return null;
    const val = activeHeap[idx];

    // Coordinates for complete tree of max size 7
    const positions: { x: number; y: number; p: number | null }[] = [
      { x: 200, y: 40, p: null }, // index 0 (Root)
      { x: 100, y: 90, p: 0 },    // index 1
      { x: 300, y: 90, p: 0 },    // index 2
      { x: 50, y: 150, p: 1 },    // index 3
      { x: 150, y: 150, p: 1 },   // index 4
      { x: 250, y: 150, p: 2 },   // index 5
      { x: 350, y: 150, p: 2 }    // index 6
    ];

    if (idx >= positions.length) return null;
    const pos = positions[idx];
    return { val, x: pos.x, y: pos.y, parentIdx: pos.p };
  };

  const treeNodes: NodeCoord[] = [];
  for (let i = 0; i < activeHeap.length; i++) {
    const coords = getCoordinates(i);
    if (coords) treeNodes.push(coords);
  }

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Heap Visualizer (Tree & Array)</h2>
              <div className="tab-group" style={{ width: '220px' }}>
                <button className={`tab-btn ${heapType === 'min' ? 'active' : ''}`} onClick={() => setHeapType('min')}>Min Heap</button>
                <button className={`tab-btn ${heapType === 'max' ? 'active' : ''}`} onClick={() => setHeapType('max')}>Max Heap</button>
              </div>
            </div>

            {/* Split layout: Left Tree, Right Array with header stats */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              {/* Canvas Header / Speedometer & Invariant Counters */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>Root: <strong style={{ color: 'var(--accent-amber)' }}>{activeHeap.length > 0 ? activeHeap[0] : 'None'}</strong></span>
                  <span>Size: <strong style={{ color: 'var(--accent-cyan)' }}>{activeHeap.length} / 7 elements</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fill Ratio:</span>
                  <div style={{
                    width: '60px',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(activeHeap.length / 7) * 100}%`,
                      height: '100%',
                      background: 'var(--accent-cyan)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                {/* Left Heap Tree Canvas */}
                <div className="visualizer-canvas-container" style={{ minHeight: '220px', position: 'relative', display: 'block' }}>
                  <svg style={{ width: '100%', height: '100%', minHeight: '200px' }}>
                    {treeNodes.map((node, idx) => {
                      if (node.parentIdx === null) return null;
                      const pCoords = getCoordinates(node.parentIdx);
                      if (!pCoords) return null;
                      return (
                        <line
                          key={`line-${idx}`}
                          x1={pCoords.x}
                          y1={pCoords.y}
                          x2={node.x}
                          y2={node.y}
                          style={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
                        />
                      );
                    })}
                  </svg>

                  {treeNodes.map((node, idx) => {
                    const isActive = currentStep.state.active === idx;
                    const isCompare = currentStep.state.compare === idx;
                    const isSuccess = currentStep.state.success === idx;

                    let nodeClass = "ds-node animate-fall";
                    if (isActive) nodeClass += " active";
                    if (isCompare) nodeClass += " compare";
                    if (isSuccess) nodeClass += " success";

                    return (
                      <div
                        key={`node-${idx}`}
                        className={nodeClass}
                        style={{
                          position: 'absolute',
                          left: `${node.x - 20}px`,
                          top: `${node.y - 20}px`,
                          width: '40px',
                          height: '40px',
                          fontSize: '12px',
                          borderRadius: '50%'
                        }}
                      >
                        {node.val}
                      </div>
                    );
                  })}
                </div>

                {/* Right Heap Array representation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>ARRAY INDEX REPRESENTATION</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {activeHeap.map((val: number, idx: number) => {
                      const isActive = currentStep.state.active === idx;
                      const isCompare = currentStep.state.compare === idx;
                      const isSuccess = currentStep.state.success === idx;

                      let blockClass = "ds-node";
                      if (isActive) blockClass += " active";
                      if (isCompare) blockClass += " compare";
                      if (isSuccess) blockClass += " success";

                      return (
                        <div key={idx} className="array-box">
                          <div className={blockClass} style={{ width: '42px', height: '42px', borderRadius: '6px' }}>
                            {val}
                          </div>
                          <span className="array-index">[{idx}]</span>
                        </div>
                      );
                    })}
                  </div>
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
            explanation={currentExplanation}
          />
        </div>

        <CodeExecutor structureType="heap" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="number" 
              placeholder="Insert Value" 
              className="custom-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{ fontSize: '13px' }}
            />

            <button className="control-btn active" onClick={() => handleInsert()}>Insert & BubbleUp</button>
            <button className="control-btn" onClick={handleDelete}>Delete Root & Heapify</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="heap" />
        </div>
      </div>
    </div>
  );
};
