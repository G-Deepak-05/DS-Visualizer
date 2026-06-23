import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep } from '../../types';
import { ArrowRight } from 'lucide-react';

interface HashTableVisualizerProps {
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({ onAddXP }) => {
  const [probeType, setProbeType] = useState<'chaining' | 'linear' | 'quadratic'>('chaining');
  const [inputValue, setInputValue] = useState('');
  const tableSize = 7;

  // Visual state storage
  // Chaining: array of arrays. Probing: array of numbers or null.
  const [chainTable, setChainTable] = useState<number[][]>([
    [], [15], [], [10, 17], [], [], [20]
  ]);
  const [probeTable, setProbeTable] = useState<(number | null)[]>([
    null, 15, null, 10, 17, null, 20
  ]);

  // Simulation steps
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(850);

  useEffect(() => {
    // Reset defaults based on type
    if (probeType === 'chaining') {
      const initChains = [[], [15], [], [10, 17], [], [], [20]];
      setChainTable(initChains);
      setSteps([{
        stepNumber: 1,
        explanation: "Initial Hash Table with Chaining. Multiple elements can occupy the same index as linked nodes.",
        state: { chains: initChains, type: 'chaining', activeBucket: -1, activeNodeIdx: -1 }
      }]);
    } else {
      const initProbes = [null, 15, null, 10, 17, null, 20];
      setProbeTable(initProbes);
      setSteps([{
        stepNumber: 1,
        explanation: `Initial Hash Table with ${probeType.toUpperCase()} Probing. Collisions are placed in open cells.`,
        state: { probes: initProbes, type: 'probing', activeIdx: -1, successIdx: -1 }
      }]);
    }
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [probeType]);

  // Insert Key
  const handleInsert = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Please specify a valid numeric key.");

    const newSteps: VisualizerStep[] = [];
    const hash = val % tableSize;

    if (probeType === 'chaining') {
      const currentChains = chainTable.map(c => [...c]);
      
      // Step 1: Show hash calculation
      newSteps.push({
        stepNumber: 1,
        explanation: `Compute hash: h(${val}) = ${val} % ${tableSize} = index ${hash}.`,
        state: { chains: chainTable.map(c => [...c]), type: 'chaining', activeBucket: hash, activeNodeIdx: -1 }
      });

      // Step 2: Push to chain
      currentChains[hash].unshift(val); // Insert at head of chaining list
      newSteps.push({
        stepNumber: 2,
        explanation: `Index ${hash} is selected. Insert ${val} at the head of the linked list bucket.`,
        state: { chains: currentChains, type: 'chaining', activeBucket: hash, activeNodeIdx: 0, successBucket: hash }
      });

      setChainTable(currentChains);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(15, `Insert ${val} to Hash Table (Chaining)`, 'visualization');
    } else {
      // Probing insert logic
      const currentProbes = [...probeTable];
      const filledCount = currentProbes.filter(x => x !== null).length;
      if (filledCount >= tableSize) return alert("Hash Table overflow! Probing table is full.");

      let i = 0;
      let inserted = false;
      let probeIdx = hash;

      newSteps.push({
        stepNumber: 1,
        explanation: `Compute initial hash: h(${val}) = ${val} % ${tableSize} = index ${hash}.`,
        state: { probes: [...probeTable], type: 'probing', activeIdx: hash, successIdx: -1 }
      });

      while (i < tableSize && !inserted) {
        if (probeType === 'linear') {
          probeIdx = (hash + i) % tableSize;
        } else {
          probeIdx = (hash + i * i) % tableSize;
        }

        const cellEmpty = currentProbes[probeIdx] === null;

        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Probe ${i}: Check index ${probeIdx} (Formula: ${probeType === 'linear' ? `(${hash} + ${i}) % ${tableSize}` : `(${hash} + ${i}²) % ${tableSize}`}). Slot is ${cellEmpty ? 'EMPTY' : 'FILLED'}.`,
          state: { probes: [...currentProbes], type: 'probing', activeIdx: probeIdx, successIdx: -1 }
        });

        if (cellEmpty) {
          currentProbes[probeIdx] = val;
          inserted = true;
          newSteps.push({
            stepNumber: newSteps.length + 1,
            explanation: `Successfully inserted key ${val} at vacant index ${probeIdx}.`,
            state: { probes: currentProbes, type: 'probing', activeIdx: -1, successIdx: probeIdx }
          });
        } else {
          i++;
        }
      }

      if (!inserted) {
        alert("Unable to insert key! Secondary clustering or probing limit reached.");
        return;
      }

      setProbeTable(currentProbes);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(20, `Insert ${val} to Hash Table (${probeType})`, 'visualization');
    }
  };

  // Search Key
  const handleSearch = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return alert("Specify key to search.");

    const newSteps: VisualizerStep[] = [];
    const hash = val % tableSize;

    if (probeType === 'chaining') {
      const chain = chainTable[hash];
      let foundIdx = -1;

      newSteps.push({
        stepNumber: 1,
        explanation: `Compute bucket hash: h(${val}) = ${val} % ${tableSize} = index ${hash}. Go to bucket ${hash}.`,
        state: { chains: chainTable, type: 'chaining', activeBucket: hash, activeNodeIdx: -1 }
      });

      for (let i = 0; i < chain.length; i++) {
        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Check list element index ${i} (Value: ${chain[i]}). Compare with search target ${val}.`,
          state: { chains: chainTable, type: 'chaining', activeBucket: hash, activeNodeIdx: i }
        });

        if (chain[i] === val) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx !== -1) {
        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Successfully found key ${val} in chain bucket ${hash} at link index ${foundIdx}!`,
          state: { chains: chainTable, type: 'chaining', successBucket: hash, successNodeIdx: foundIdx }
        });
      } else {
        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Key ${val} not found in chain bucket ${hash}.`,
          state: { chains: chainTable, type: 'chaining', activeBucket: -1, activeNodeIdx: -1 }
        });
      }

      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(15, `Search Hash Table for ${val}`, 'visualization');
    } else {
      // Probing search
      let i = 0;
      let found = false;
      let probeIdx = hash;

      newSteps.push({
        stepNumber: 1,
        explanation: `Compute search hash: h(${val}) = ${val} % ${tableSize} = index ${hash}.`,
        state: { probes: probeTable, type: 'probing', activeIdx: hash, successIdx: -1 }
      });

      while (i < tableSize) {
        if (probeType === 'linear') {
          probeIdx = (hash + i) % tableSize;
        } else {
          probeIdx = (hash + i * i) % tableSize;
        }

        const cellVal = probeTable[probeIdx];

        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Probe ${i}: Check index ${probeIdx} (Value: ${cellVal === null ? 'EMPTY' : cellVal}).`,
          state: { probes: probeTable, type: 'probing', activeIdx: probeIdx, successIdx: -1 }
        });

        if (cellVal === val) {
          found = true;
          newSteps.push({
            stepNumber: newSteps.length + 1,
            explanation: `Successfully found key ${val} at index ${probeIdx}!`,
            state: { probes: probeTable, type: 'probing', activeIdx: -1, successIdx: probeIdx }
          });
          break;
        } else if (cellVal === null) {
          // empty cell terminates probe search
          newSteps.push({
            stepNumber: newSteps.length + 1,
            explanation: `Vacant slot hit at index ${probeIdx}. Search terminated. Key not found.`,
            state: { probes: probeTable, type: 'probing', activeIdx: -1, successIdx: -1 }
          });
          break;
        }
        i++;
      }

      if (!found && i === tableSize) {
        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Reached probe search limit. Key ${val} is not present in hash table.`,
          state: { probes: probeTable, type: 'probing', activeIdx: -1, successIdx: -1 }
        });
      }

      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(15, `Search Hash Table for ${val}`, 'visualization');
    }
  };

  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    // simplified script runs
    if (commands.length > 0) {
      handleInsert(Number(commands[0].params[0]));
    }
  };

  const currentStep = steps[currentStepIndex] || {
    state: { type: 'chaining', chains: chainTable, probes: probeTable, activeBucket: -1, activeIdx: -1 },
    explanation: ""
  };

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Hash Table Simulation</h2>
              <div className="tab-group" style={{ width: '380px' }}>
                <button className={`tab-btn ${probeType === 'chaining' ? 'active' : ''}`} onClick={() => setProbeType('chaining')}>Chaining</button>
                <button className={`tab-btn ${probeType === 'linear' ? 'active' : ''}`} onClick={() => setProbeType('linear')}>Linear Probe</button>
                <button className={`tab-btn ${probeType === 'quadratic' ? 'active' : ''}`} onClick={() => setProbeType('quadratic')}>Quadratic Probe</button>
              </div>
            </div>

            {/* Visualizer Canvas container */}
            <div className="visualizer-canvas-container" style={{ minHeight: '260px', overflowY: 'auto' }}>
              
              {/* Chaining Layout */}
              {currentStep.state.type === 'chaining' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px' }}>
                  {currentStep.state.chains.map((chain: number[], bucketIdx: number) => {
                    const isBucketActive = currentStep.state.activeBucket === bucketIdx || currentStep.state.successBucket === bucketIdx;
                    const activeNodeIdx = currentStep.state.activeNodeIdx;
                    const successNodeIdx = currentStep.state.successNodeIdx;

                    return (
                      <div key={bucketIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Index Bucket */}
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: isBucketActive ? 'var(--accent-indigo)' : 'var(--bg-tertiary)',
                          border: `1px solid ${isBucketActive ? 'var(--accent-cyan)' : 'var(--glass-border)'}`
                        }}>
                          {bucketIdx}
                        </div>
                        <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />

                        {/* Chain List */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {chain.map((nodeVal, nodeIdx) => {
                            const isNodeActive = isBucketActive && activeNodeIdx === nodeIdx;
                            const isNodeSuccess = currentStep.state.successBucket === bucketIdx && successNodeIdx === nodeIdx;
                            
                            let nodeClass = "ds-node";
                            if (isNodeActive) nodeClass += " active";
                            if (isNodeSuccess) nodeClass += " success";

                            return (
                              <React.Fragment key={nodeIdx}>
                                <div className={nodeClass} style={{ width: '40px', height: '32px', fontSize: '12px', borderRadius: '4px' }}>
                                  {nodeVal}
                                </div>
                                <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                              </React.Fragment>
                            );
                          })}
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NULL</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Probing Layout */
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {currentStep.state.probes.map((cell: number | null, cellIdx: number) => {
                    const isActive = currentStep.state.activeIdx === cellIdx;
                    const isSuccess = currentStep.state.successIdx === cellIdx;

                    let cellClass = "ds-node";
                    if (isActive) cellClass += " active";
                    if (isSuccess) cellClass += " success";

                    return (
                      <div key={cellIdx} className="array-box">
                        <div 
                          className={cellClass}
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '6px',
                            background: cell === null ? 'transparent' : undefined,
                            borderStyle: cell === null ? 'dashed' : 'solid',
                            borderColor: cell === null ? 'rgba(255, 255, 255, 0.15)' : undefined
                          }}
                        >
                          {cell !== null ? cell : '-'}
                        </div>
                        <span className="array-index">Index {cellIdx}</span>
                      </div>
                    );
                  })}
                </div>
              )}
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

        <CodeExecutor structureType="hash-table" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="number" 
              placeholder="Enter Key (e.g. 15, 22)" 
              className="custom-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{ fontSize: '13px' }}
            />

            <button className="control-btn active" onClick={() => handleInsert()}>Insert (key % 7)</button>
            <button className="control-btn" onClick={handleSearch}>Search Key</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="hash-table" />
        </div>
      </div>
    </div>
  );
};
