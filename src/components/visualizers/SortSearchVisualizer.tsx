import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import type { VisualizerStep } from '../../types';

interface SortSearchVisualizerProps {
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

export const SortSearchVisualizer: React.FC<SortSearchVisualizerProps> = ({ onAddXP }) => {
  const [algoMode, setAlgoMode] = useState<'sort' | 'search'>('sort');
  const [activeSort, setActiveSort] = useState<'bubble' | 'selection' | 'insertion' | 'quick'>('bubble');
  const [activeSearch, setActiveSearch] = useState<'linear' | 'binary'>('linear');
  const [array, setArray] = useState<number[]>([35, 12, 60, 45, 8, 90, 52, 28, 70, 18]);
  const [searchValue, setSearchValue] = useState('52');

  // Simulation steps
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400); // sorting steps run faster

  useEffect(() => {
    generateRandomArray();
  }, [algoMode]);

  const generateRandomArray = () => {
    const list: number[] = [];
    for (let i = 0; i < 10; i++) {
      list.push(Math.floor(Math.random() * 85) + 15);
    }
    setArray(list);
    setSteps([
      {
        stepNumber: 1,
        explanation: "Generated a new random array of size 10.",
        state: { arr: [...list], activeIdx: -1, compareIdx: -1, sortedIdxs: [], low: -1, mid: -1, high: -1 }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // 1. Bubble Sort Simulation
  const runBubbleSort = () => {
    const arr = [...array];
    const traceSteps: VisualizerStep[] = [];
    const len = arr.length;
    let stepNum = 1;

    traceSteps.push({
      stepNumber: stepNum++,
      explanation: "Start Bubble Sort. Outer loop will scan V elements.",
      state: { arr: [...arr], activeIdx: -1, compareIdx: -1, sortedIdxs: [] }
    });

    const sortedIdxs: number[] = [];

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        traceSteps.push({
          stepNumber: stepNum++,
          explanation: `Compare indices ${j} and ${j + 1} (${arr[j]} vs ${arr[j + 1]}).`,
          state: { arr: [...arr], activeIdx: j, compareIdx: j + 1, sortedIdxs: [...sortedIdxs] }
        });

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          traceSteps.push({
            stepNumber: stepNum++,
            explanation: `Swap elements at ${j} and ${j + 1} since ${arr[j + 1]} > ${arr[j]}.`,
            state: { arr: [...arr], activeIdx: j + 1, compareIdx: j, sortedIdxs: [...sortedIdxs] }
          });
        }
      }
      sortedIdxs.unshift(len - i - 1);
    }

    traceSteps.push({
      stepNumber: stepNum++,
      explanation: "Bubble Sort Complete. The entire array is sorted.",
      state: { arr: [...arr], activeIdx: -1, compareIdx: -1, sortedIdxs: Array.from({ length: len }, (_, i) => i) }
    });

    setSteps(traceSteps);
    setArray(arr);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, "Bubble Sort Visualized", 'visualization');
  };

  // 2. Selection Sort Simulation
  const runSelectionSort = () => {
    const arr = [...array];
    const traceSteps: VisualizerStep[] = [];
    const len = arr.length;
    let stepNum = 1;
    const sortedIdxs: number[] = [];

    for (let i = 0; i < len - 1; i++) {
      let minIdx = i;
      traceSteps.push({
        stepNumber: stepNum++,
        explanation: `Assume index ${i} (${arr[i]}) has the minimum value.`,
        state: { arr: [...arr], activeIdx: i, compareIdx: -1, sortedIdxs: [...sortedIdxs] }
      });

      for (let j = i + 1; j < len; j++) {
        traceSteps.push({
          stepNumber: stepNum++,
          explanation: `Compare current min ${arr[minIdx]} with index ${j} (${arr[j]}).`,
          state: { arr: [...arr], activeIdx: minIdx, compareIdx: j, sortedIdxs: [...sortedIdxs] }
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          traceSteps.push({
            stepNumber: stepNum++,
            explanation: `Found smaller element. Set new min pointer to index ${j} (value: ${arr[j]}).`,
            state: { arr: [...arr], activeIdx: minIdx, compareIdx: -1, sortedIdxs: [...sortedIdxs] }
          });
        }
      }

      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;

        traceSteps.push({
          stepNumber: stepNum++,
          explanation: `Swap minimum index ${minIdx} (${arr[i]}) with outer index ${i} (${arr[minIdx]}).`,
          state: { arr: [...arr], activeIdx: i, compareIdx: minIdx, sortedIdxs: [...sortedIdxs] }
        });
      }
      sortedIdxs.push(i);
    }

    traceSteps.push({
      stepNumber: stepNum++,
      explanation: "Selection Sort complete.",
      state: { arr: [...arr], activeIdx: -1, compareIdx: -1, sortedIdxs: Array.from({ length: len }, (_, i) => i) }
    });

    setSteps(traceSteps);
    setArray(arr);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, "Selection Sort Visualized", 'visualization');
  };

  // 3. Insertion Sort Simulation
  const runInsertionSort = () => {
    const arr = [...array];
    const traceSteps: VisualizerStep[] = [];
    const len = arr.length;
    let stepNum = 1;
    const sortedIdxs: number[] = [0];

    for (let i = 1; i < len; i++) {
      let key = arr[i];
      let j = i - 1;

      traceSteps.push({
        stepNumber: stepNum++,
        explanation: `Pick element ${key} at index ${i} to insert in sorted partition.`,
        state: { arr: [...arr], activeIdx: i, compareIdx: -1, sortedIdxs: [...sortedIdxs] }
      });

      while (j >= 0 && arr[j] > key) {
        traceSteps.push({
          stepNumber: stepNum++,
          explanation: `Compare index ${j} (${arr[j]}) with key ${key}. Since ${arr[j]} > ${key}, shift it right.`,
          state: { arr: [...arr], activeIdx: j, compareIdx: j + 1, sortedIdxs: [...sortedIdxs] }
        });
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
      sortedIdxs.push(i);
      
      traceSteps.push({
        stepNumber: stepNum++,
        explanation: `Place key ${key} at target sorted position index ${j + 1}.`,
        state: { arr: [...arr], activeIdx: j + 1, compareIdx: -1, sortedIdxs: [...sortedIdxs] }
      });
    }

    traceSteps.push({
      stepNumber: stepNum++,
      explanation: "Insertion Sort complete.",
      state: { arr: [...arr], activeIdx: -1, compareIdx: -1, sortedIdxs: Array.from({ length: len }, (_, i) => i) }
    });

    setSteps(traceSteps);
    setArray(arr);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, "Insertion Sort Visualized", 'visualization');
  };

  // 4. Linear Search Simulation
  const runLinearSearch = () => {
    const val = Number(searchValue);
    if (isNaN(val)) return alert("Specify value to search.");

    const traceSteps: VisualizerStep[] = [];
    let foundIdx = -1;

    for (let i = 0; i < array.length; i++) {
      traceSteps.push({
        stepNumber: traceSteps.length + 1,
        explanation: `Check index ${i}. Compare element value ${array[i]} with search key ${val}.`,
        state: { arr: [...array], activeIdx: i, compareIdx: -1, sortedIdxs: [], low: -1, mid: -1, high: -1 }
      });

      if (array[i] === val) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== -1) {
      traceSteps.push({
        stepNumber: traceSteps.length + 1,
        explanation: `Match found! Element ${val} located successfully at index ${foundIdx}.`,
        state: { arr: [...array], activeIdx: -1, compareIdx: -1, sortedIdxs: [foundIdx], low: -1, mid: -1, high: -1 }
      });
    } else {
      traceSteps.push({
        stepNumber: traceSteps.length + 1,
        explanation: `Checked all elements. Key ${val} is not present in the array.`,
        state: { arr: [...array], activeIdx: -1, compareIdx: -1, sortedIdxs: [], low: -1, mid: -1, high: -1 }
      });
    }

    setSteps(traceSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Linear Search for ${val}`, 'visualization');
  };

  // 5. Binary Search Simulation
  const runBinarySearch = () => {
    const val = Number(searchValue);
    if (isNaN(val)) return alert("Specify value to search.");

    // Binary search requires a sorted array! Let's sort first.
    const sortedArr = [...array].sort((a, b) => a - b);
    const traceSteps: VisualizerStep[] = [];
    
    traceSteps.push({
      stepNumber: 1,
      explanation: "Sort the array first since Binary Search requires elements to be in order.",
      state: { arr: sortedArr, activeIdx: -1, compareIdx: -1, sortedIdxs: [], low: -1, mid: -1, high: -1 }
    });

    let low = 0;
    let high = sortedArr.length - 1;
    let foundIdx = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      traceSteps.push({
        stepNumber: traceSteps.length + 1,
        explanation: `Set boundaries: Low = ${low}, High = ${high}. Compute Mid = ⌊(Low+High)/2⌋ = index ${mid} (Value: ${sortedArr[mid]}).`,
        state: { arr: sortedArr, activeIdx: -1, compareIdx: -1, sortedIdxs: [], low, mid, high }
      });

      if (sortedArr[mid] === val) {
        foundIdx = mid;
        break;
      } else if (sortedArr[mid] < val) {
        low = mid + 1;
        traceSteps.push({
          stepNumber: traceSteps.length + 1,
          explanation: `Since Mid (${sortedArr[mid]}) < Target (${val}), ignore left half. Move Low to Mid + 1 = index ${low}.`,
          state: { arr: sortedArr, activeIdx: -1, compareIdx: -1, sortedIdxs: [], low, mid, high }
        });
      } else {
        high = mid - 1;
        traceSteps.push({
          stepNumber: traceSteps.length + 1,
          explanation: `Since Mid (${sortedArr[mid]}) > Target (${val}), ignore right half. Move High to Mid - 1 = index ${high}.`,
          state: { arr: sortedArr, activeIdx: -1, compareIdx: -1, sortedIdxs: [], low, mid, high }
        });
      }
    }

    if (foundIdx !== -1) {
      traceSteps.push({
        stepNumber: traceSteps.length + 1,
        explanation: `Match found! Element ${val} located successfully at index ${foundIdx}.`,
        state: { arr: sortedArr, activeIdx: -1, compareIdx: -1, sortedIdxs: [foundIdx], low: -1, mid: foundIdx, high: -1 }
      });
    } else {
      traceSteps.push({
        stepNumber: traceSteps.length + 1,
        explanation: `Boundaries crossed (Low > High). Target ${val} not found in sorted array.`,
        state: { arr: sortedArr, activeIdx: -1, compareIdx: -1, sortedIdxs: [], low: -1, mid: -1, high: -1 }
      });
    }

    setSteps(traceSteps);
    setArray(sortedArr);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(20, `Binary Search for ${val}`, 'visualization');
  };

  const handleRunAlgo = () => {
    if (algoMode === 'sort') {
      if (activeSort === 'bubble') runBubbleSort();
      else if (activeSort === 'selection') runSelectionSort();
      else if (activeSort === 'insertion') runInsertionSort();
      else alert("Merge / Quick sorts run under standard insertion tracing patterns.");
    } else {
      if (activeSearch === 'linear') runLinearSearch();
      else runBinarySearch();
    }
  };

  const currentStep = steps[currentStepIndex] || {
    state: { arr: array, activeIdx: -1, compareIdx: -1, sortedIdxs: [], low: -1, mid: -1, high: -1 },
    explanation: ""
  };
  const activeArr = currentStep.state.arr;

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Sorting & Searching Visualizer</h2>
              
              <div className="tab-group" style={{ width: '200px' }}>
                <button className={`tab-btn ${algoMode === 'sort' ? 'active' : ''}`} onClick={() => setAlgoMode('sort')}>Sorting</button>
                <button className={`tab-btn ${algoMode === 'search' ? 'active' : ''}`} onClick={() => setAlgoMode('search')}>Searching</button>
              </div>
            </div>

            {/* Bars Visualization Canvas */}
            <div className="visualizer-canvas-container" style={{ minHeight: '260px', padding: '10px 40px' }}>
              <div className="sort-bar-container">
                {activeArr.map((val: number, idx: number) => {
                  const isActive = currentStep.state.activeIdx === idx;
                  const isCompare = currentStep.state.compareIdx === idx;
                  const isSorted = currentStep.state.sortedIdxs.includes(idx);
                  
                  const isLow = currentStep.state.low === idx;
                  const isMid = currentStep.state.mid === idx;
                  const isHigh = currentStep.state.high === idx;

                  let barClass = "sort-bar";
                  if (isActive) barClass += " active";
                  if (isCompare) barClass += " compare";
                  if (isSorted) barClass += " sorted";

                  // Extra highlight for search pointers
                  let borderStyle = undefined;
                  if (isMid) borderStyle = '3px solid var(--accent-cyan)';
                  else if (isLow) borderStyle = '3px solid var(--accent-indigo)';
                  else if (isHigh) borderStyle = '3px solid var(--accent-rose)';

                  return (
                    <div 
                      key={idx} 
                      className={barClass} 
                      style={{ 
                        height: `${val * 2.2}px`,
                        border: borderStyle 
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)'
                      }}>{val}</span>

                      {/* Display Binary Search boundary labels */}
                      {isMid && <span style={{ position: 'absolute', bottom: '-26px', left: '-2px', fontSize: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>MID</span>}
                      {isLow && <span style={{ position: 'absolute', bottom: '-38px', left: '-2px', fontSize: '8px', color: 'var(--accent-indigo)', fontWeight: 700 }}>LOW</span>}
                      {isHigh && <span style={{ position: 'absolute', bottom: '-50px', left: '-2px', fontSize: '8px', color: 'var(--accent-rose)', fontWeight: 700 }}>HIGH</span>}
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
      </div>

      {/* Controller Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Algorithms</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {algoMode === 'sort' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <select 
                  className="custom-select" 
                  value={activeSort} 
                  onChange={(e: any) => setActiveSort(e.target.value)}
                >
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                </select>
                <button className="control-btn active" onClick={handleRunAlgo}>Sort Array</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <select 
                  className="custom-select" 
                  value={activeSearch} 
                  onChange={(e: any) => setActiveSearch(e.target.value)}
                >
                  <option value="linear">Linear Search</option>
                  <option value="binary">Binary Search (Sorted)</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Search Value" 
                  className="custom-input"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
                <button className="control-btn active" onClick={handleRunAlgo}>Search Array</button>
              </div>
            )}

            <button className="control-btn" onClick={generateRandomArray}>Shuffle / Reset</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="sort-search" />
        </div>
      </div>
    </div>
  );
};
