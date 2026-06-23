import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep } from '../../types';

interface ArrayVisualizerProps {
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ onAddXP }) => {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40]);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  
  // Animation Trace Queue
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  // Initialize with dummy step
  useEffect(() => {
    resetSteps([10, 20, 30, 40], "Initial array structure.");
  }, []);

  const resetSteps = (initialArray: number[], initialMessage: string) => {
    setSteps([
      {
        stepNumber: 1,
        explanation: initialMessage,
        state: { arr: [...initialArray], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Perform Operation: Create
  const handleCreate = () => {
    const vals = sizeInput.split(',').map(x => Number(x.trim())).filter(x => !isNaN(x));
    if (vals.length === 0) return alert("Please enter comma-separated numbers like: 5, 10, 15");
    setArray(vals);
    resetSteps(vals, `Created a new array of size ${vals.length}.`);
    onAddXP(10, 'Create Array', 'visualization');
  };

  // Perform Operation: Insert
  const handleInsert = (idxParam?: number, valParam?: number) => {
    const idx = idxParam !== undefined ? idxParam : Number(inputIndex);
    const val = valParam !== undefined ? valParam : Number(inputValue);

    if (isNaN(idx) || isNaN(val)) return alert("Please specify valid Index and Value.");
    if (idx < 0 || idx > array.length) return alert(`Index out of bounds! Must be between 0 and ${array.length}`);

    const newSteps: VisualizerStep[] = [];
    const currentArr = [...array];
    
    // Step 1: Highlight target insert position
    newSteps.push({
      stepNumber: 1,
      explanation: `Check index ${idx} to see where to insert element ${val}.`,
      state: { arr: [...currentArr], activeIdx: idx, compareIdx: -1, insertAt: idx, successIdx: -1 }
    });

    // Step 2: Show element shifting (if index is in middle)
    if (idx < currentArr.length) {
      newSteps.push({
        stepNumber: 2,
        explanation: `Shift elements from index ${idx} to index ${currentArr.length - 1} one slot to the right.`,
        state: { arr: [...currentArr], activeIdx: -1, compareIdx: -1, insertAt: idx, shifting: true, successIdx: -1 }
      });
    }

    // Step 3: Insert element
    currentArr.splice(idx, 0, val);
    newSteps.push({
      stepNumber: newSteps.length + 1,
      explanation: `Insert element ${val} at index ${idx}.`,
      state: { arr: [...currentArr], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: idx }
    });

    setSteps(newSteps);
    setArray(currentArr);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Insert ${val} into Array`, 'visualization');
  };

  // Perform Operation: Delete
  const handleDelete = (idxParam?: number) => {
    const idx = idxParam !== undefined ? idxParam : Number(inputIndex);
    if (isNaN(idx) || idx < 0 || idx >= array.length) return alert(`Please enter a valid index between 0 and ${array.length - 1}`);

    const newSteps: VisualizerStep[] = [];
    const currentArr = [...array];
    
    // Step 1: Highlight item to delete
    newSteps.push({
      stepNumber: 1,
      explanation: `Locate node at index ${idx} for deletion (Value: ${currentArr[idx]}).`,
      state: { arr: [...currentArr], activeIdx: idx, compareIdx: -1, insertAt: -1, successIdx: -1 }
    });

    // Step 2: Remove and shift left
    const deletedVal = currentArr[idx];
    currentArr.splice(idx, 1);
    
    newSteps.push({
      stepNumber: 2,
      explanation: `Remove ${deletedVal} and shift subsequent elements left to close the gap.`,
      state: { arr: [...currentArr], activeIdx: -1, compareIdx: -1, insertAt: -1, shifting: true, successIdx: -1 }
    });

    setSteps(newSteps);
    setArray(currentArr);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Delete Index ${idx} from Array`, 'visualization');
  };

  // Perform Operation: Update
  const handleUpdate = (idxParam?: number, valParam?: number) => {
    const idx = idxParam !== undefined ? idxParam : Number(inputIndex);
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(idx) || isNaN(val) || idx < 0 || idx >= array.length) return alert(`Please enter a valid index (0 to ${array.length - 1}) and value.`);

    const currentArr = [...array];
    const prevVal = currentArr[idx];
    currentArr[idx] = val;

    const newSteps: VisualizerStep[] = [
      {
        stepNumber: 1,
        explanation: `Identify element at index ${idx} (Current Value: ${prevVal}).`,
        state: { arr: [...array], activeIdx: idx, compareIdx: -1, insertAt: -1, successIdx: -1 }
      },
      {
        stepNumber: 2,
        explanation: `Update value at index ${idx} to ${val}.`,
        state: { arr: [...currentArr], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: idx }
      }
    ];

    setSteps(newSteps);
    setArray(currentArr);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Update Array index ${idx}`, 'visualization');
  };

  // Perform Operation: Search
  const handleSearch = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Please specify a numeric Search Value.");

    const newSteps: VisualizerStep[] = [];
    let foundIdx = -1;

    for (let i = 0; i < array.length; i++) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Compare index ${i} (Value: ${array[i]}) with search target ${val}.`,
        state: { arr: [...array], activeIdx: -1, compareIdx: i, insertAt: -1, successIdx: -1 }
      });

      if (array[i] === val) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== -1) {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Target value ${val} found successfully at index ${foundIdx}!`,
        state: { arr: [...array], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: foundIdx }
      });
    } else {
      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Search target ${val} not found in the array.`,
        state: { arr: [...array], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 }
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, `Search Array for ${val}`, 'visualization');
  };

  // Code Executor integrations
  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    // Run the sequence of commands
    // Simply perform each one sequentially on the current array and record visualizer state
    let tempArr = [...array];
    const generatedSteps: VisualizerStep[] = [];
    let currentStepNumber = 1;

    commands.forEach((cmd) => {
      const { action, params } = cmd;
      if (action === 'insert') {
        const idx = Number(params[0]);
        const val = Number(params[1]);
        if (!isNaN(idx) && !isNaN(val) && idx >= 0 && idx <= tempArr.length) {
          tempArr.splice(idx, 0, val);
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code triggered: insert value ${val} at index ${idx}.`,
            state: { arr: [...tempArr], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: idx }
          });
        }
      } else if (action === 'delete' || action === 'remove') {
        const idx = Number(params[0]);
        if (!isNaN(idx) && idx >= 0 && idx < tempArr.length) {
          const removed = tempArr.splice(idx, 1)[0];
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code triggered: remove element at index ${idx} (value: ${removed}).`,
            state: { arr: [...tempArr], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 }
          });
        }
      } else if (action === 'update' || action === 'set') {
        const idx = Number(params[0]);
        const val = Number(params[1]);
        if (!isNaN(idx) && !isNaN(val) && idx >= 0 && idx < tempArr.length) {
          tempArr[idx] = val;
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code triggered: set index ${idx} to ${val}.`,
            state: { arr: [...tempArr], activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: idx }
          });
        }
      }
    });

    if (generatedSteps.length > 0) {
      setArray(tempArr);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(25, 'Run Custom Array Script', 'visualization');
    }
  };

  const currentStep = steps[currentStepIndex] || {
    state: { arr: array, activeIdx: -1, compareIdx: -1, insertAt: -1, successIdx: -1 },
    explanation: ""
  };
  const activeArr = currentStep.state.arr;

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Primary visualizer panels */}
      <div>
        <div className="glass-panel" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Array Sandbox Visualizer</h2>
            
            {/* Visualizer Canvas Container */}
            <div className="visualizer-canvas-container">
              <div className="array-container">
                {activeArr.map((val: number, idx: number) => {
                  const isActive = currentStep.state.activeIdx === idx;
                  const isCompare = currentStep.state.compareIdx === idx;
                  const isSuccess = currentStep.state.successIdx === idx;
                  const isShift = currentStep.state.shifting && idx >= currentStep.state.insertAt;
                  
                  let classNames = "ds-node";
                  if (isActive) classNames += " active";
                  if (isCompare) classNames += " compare";
                  if (isSuccess) classNames += " success";
                  
                  return (
                    <div key={idx} className="array-box" style={{ 
                      transform: isShift ? 'translateX(10px)' : 'none',
                      transition: 'transform 0.4s ease'
                    }}>
                      <div className={classNames}>
                        {val}
                      </div>
                      <span className="array-index">{idx}</span>
                    </div>
                  );
                })}
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

        {/* Custom script editor integration */}
        <CodeExecutor structureType="array" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Control Panel / Sidebar panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Input fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="Index" 
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
              <button className="control-btn" onClick={() => handleInsert()}>Insert</button>
              <button className="control-btn" onClick={() => handleDelete()}>Delete</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="control-btn" onClick={() => handleUpdate()}>Update</button>
              <button className="control-btn" onClick={() => handleSearch()}>Search</button>
            </div>

            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '4px 0' }} />

            {/* Create Array Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>NEW ARRAY (COMMA-SEPARATED)</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. 10, 20, 30, 40" 
                  className="custom-input"
                  value={sizeInput}
                  onChange={e => setSizeInput(e.target.value)}
                  style={{ flex: 1, fontSize: '12px' }}
                />
                <button className="control-btn" onClick={handleCreate} style={{ fontSize: '12px', padding: '6px 12px' }}>Create</button>
              </div>
            </div>
          </div>
        </div>

        {/* Complexity Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="array" />
        </div>
      </div>
    </div>
  );
};
