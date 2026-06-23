import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep } from '../../types';

interface QueueVisualizerProps {
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

interface QueueNode {
  value: number;
  priority?: number;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ onAddXP }) => {
  const [queueType, setQueueType] = useState<'simple' | 'circular' | 'deque' | 'priority'>('simple');
  const [queue, setQueue] = useState<QueueNode[]>([
    { value: 10 },
    { value: 20 },
    { value: 30 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [priorityValue, setPriorityValue] = useState('');

  // Circular Queue index bounds
  const [frontIdx, setFrontIdx] = useState(0);
  const [rearIdx, setRearIdx] = useState(2);
  const circularCapacity = 5;
  const [circularSlots, setCircularSlots] = useState<(number | null)[]>([10, 20, 30, null, null]);

  // Simulation steps
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  useEffect(() => {
    if (queueType === 'circular') {
      setFrontIdx(0);
      setRearIdx(2);
      setCircularSlots([10, 20, 30, null, null]);
      setSteps([{
        stepNumber: 1,
        explanation: "Initial Circular Queue state with indices. Front points to 0, Rear points to 2.",
        state: { slots: [10, 20, 30, null, null], front: 0, rear: 2, active: -1, type: 'circular' }
      }]);
    } else if (queueType === 'priority') {
      const initQ = [{ value: 30, priority: 3 }, { value: 10, priority: 1 }];
      setQueue(initQ);
      setSteps([{
        stepNumber: 1,
        explanation: "Initial Priority Queue sorted by Priority ascending.",
        state: { q: [...initQ], active: -1, compare: -1, type: 'priority' }
      }]);
    } else {
      const initQ = [{ value: 10 }, { value: 20 }, { value: 30 }];
      setQueue(initQ);
      setSteps([{
        stepNumber: 1,
        explanation: "Initial linear queue state.",
        state: { q: [...initQ], active: -1, type: 'linear' }
      }]);
    }
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [queueType]);

  // Enqueue
  const handleEnqueue = (valParam?: number, isFront: boolean = false) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Please specify a valid value.");

    if (queueType === 'circular') {
      // Circular queue logic
      const activeCount = circularSlots.filter(x => x !== null).length;
      if (activeCount >= circularCapacity) return alert("Queue overflow! Circular queue is full.");
      
      const newRear = (rearIdx + 1) % circularCapacity;
      const updatedSlots = [...circularSlots];
      updatedSlots[newRear] = val;

      const newSteps: VisualizerStep[] = [
        {
          stepNumber: 1,
          explanation: `Locate next insert slot. Rear increments to (${rearIdx} + 1) % ${circularCapacity} = index ${newRear}.`,
          state: { slots: [...circularSlots], front: frontIdx, rear: rearIdx, active: newRear, type: 'circular' }
        },
        {
          stepNumber: 2,
          explanation: `Enqueue element ${val} at Rear index ${newRear}.`,
          state: { slots: updatedSlots, front: frontIdx, rear: newRear, success: newRear, type: 'circular' }
        }
      ];

      setCircularSlots(updatedSlots);
      setRearIdx(newRear);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(15, `Enqueue ${val} to Circular Queue`, 'visualization');
      return;
    }

    if (queueType === 'priority') {
      // Priority queue sorted insertion
      const prio = Number(priorityValue) || 5; // default priority
      const newSteps: VisualizerStep[] = [];
      const updatedQ = [...queue];
      
      // Add to end
      const newNode = { value: val, priority: prio };
      updatedQ.push(newNode);
      newSteps.push({
        stepNumber: 1,
        explanation: `Append element ${val} with priority ${prio} to the rear of queue.`,
        state: { q: [...queue, newNode], active: queue.length, type: 'priority' }
      });

      // Sort by priority ascending (bubble sort animation logic)
      let currentIdx = updatedQ.length - 1;
      while (currentIdx > 0 && updatedQ[currentIdx].priority! < updatedQ[currentIdx - 1].priority!) {
        const temp = updatedQ[currentIdx];
        updatedQ[currentIdx] = updatedQ[currentIdx - 1];
        updatedQ[currentIdx - 1] = temp;
        
        newSteps.push({
          stepNumber: newSteps.length + 1,
          explanation: `Compare priority ${updatedQ[currentIdx].priority} vs ${updatedQ[currentIdx - 1].priority}. Swap to sort.`,
          state: { q: [...updatedQ], compare: currentIdx - 1, active: currentIdx, type: 'priority' }
        });
        currentIdx--;
      }

      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Element ${val} placed at sorted position index ${currentIdx}.`,
        state: { q: [...updatedQ], success: currentIdx, type: 'priority' }
      });

      setQueue(updatedQ);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(20, `Enqueue ${val} Priority Queue`, 'visualization');
      return;
    }

    // Linear Queue & Deque
    const currentQ = [...queue];
    if (currentQ.length >= 6) return alert("Queue limit reached in this visualizer.");

    const newSteps: VisualizerStep[] = [];
    
    if (isFront) {
      // Deque front insert
      currentQ.unshift({ value: val });
      newSteps.push({
        stepNumber: 1,
        explanation: `Insert node ${val} at the Front of Deque.`,
        state: { q: currentQ, success: 0, type: 'linear' }
      });
    } else {
      // Standard / Deque rear insert
      currentQ.push({ value: val });
      newSteps.push({
        stepNumber: 1,
        explanation: `Insert node ${val} at the Rear (back) of Queue.`,
        state: { q: currentQ, success: currentQ.length - 1, type: 'linear' }
      });
    }

    setQueue(currentQ);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Enqueue ${val} to Queue`, 'visualization');
  };

  // Dequeue
  const handleDequeue = (isRear: boolean = false) => {
    if (queueType === 'circular') {
      const activeCount = circularSlots.filter(x => x !== null).length;
      if (activeCount === 0) return alert("Queue underflow! Circular queue is empty.");

      const updatedSlots = [...circularSlots];
      const poppedVal = updatedSlots[frontIdx];
      updatedSlots[frontIdx] = null;
      const newFront = (frontIdx + 1) % circularCapacity;

      const newSteps: VisualizerStep[] = [
        {
          stepNumber: 1,
          explanation: `Locate Front element at index ${frontIdx} (value: ${poppedVal}).`,
          state: { slots: [...circularSlots], front: frontIdx, rear: rearIdx, active: frontIdx, type: 'circular' }
        },
        {
          stepNumber: 2,
          explanation: `Dequeue element. Increment Front pointer to (${frontIdx} + 1) % ${circularCapacity} = index ${newFront}.`,
          state: { slots: updatedSlots, front: newFront, rear: rearIdx, type: 'circular' }
        }
      ];

      setCircularSlots(updatedSlots);
      setFrontIdx(newFront);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(15, 'Dequeue Circular Queue', 'visualization');
      return;
    }

    if (queue.length === 0) return alert("Queue underflow! Queue is empty.");

    const currentQ = [...queue];
    const newSteps: VisualizerStep[] = [];

    if (isRear) {
      // Deque rear pop
      const popped = currentQ.pop();
      newSteps.push({
        stepNumber: 1,
        explanation: `Dequeue (remove) element ${popped?.value} from the Rear of Deque.`,
        state: { q: currentQ, type: 'linear' }
      });
    } else {
      // Standard / Deque front pop
      const popped = currentQ.shift();
      newSteps.push({
        stepNumber: 1,
        explanation: `Dequeue (remove) element ${popped?.value} from the Front of Queue.`,
        state: { q: currentQ, type: 'linear' }
      });
    }

    setQueue(currentQ);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, 'Dequeue Queue', 'visualization');
  };

  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    let tempQ = [...queue];
    const generatedSteps: VisualizerStep[] = [];
    let currentStepNumber = 1;

    commands.forEach((cmd) => {
      const { action, params } = cmd;
      if (action === 'enqueue' || action === 'add' || action === 'push') {
        const val = Number(params[0]);
        if (!isNaN(val) && tempQ.length < 6) {
          tempQ.push({ value: val });
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: enqueue ${val}.`,
            state: { q: [...tempQ], success: tempQ.length - 1, type: 'linear' }
          });
        }
      } else if (action === 'dequeue' || action === 'shift' || action === 'remove') {
        if (tempQ.length > 0) {
          const removed = tempQ.shift();
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: dequeue (removed front value: ${removed?.value}).`,
            state: { q: [...tempQ], type: 'linear' }
          });
        }
      }
    });

    if (generatedSteps.length > 0) {
      setQueue(tempQ);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(25, 'Run Custom Queue Script', 'visualization');
    }
  };

  const currentStep = steps[currentStepIndex] || {
    state: { q: queue, slots: circularSlots, front: frontIdx, rear: rearIdx, type: 'linear' },
    explanation: ""
  };

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Queue Visualizer</h2>
              <div className="tab-group" style={{ width: '380px' }}>
                <button className={`tab-btn ${queueType === 'simple' ? 'active' : ''}`} onClick={() => setQueueType('simple')}>Simple</button>
                <button className={`tab-btn ${queueType === 'circular' ? 'active' : ''}`} onClick={() => setQueueType('circular')}>Circular</button>
                <button className={`tab-btn ${queueType === 'deque' ? 'active' : ''}`} onClick={() => setQueueType('deque')}>Deque</button>
                <button className={`tab-btn ${queueType === 'priority' ? 'active' : ''}`} onClick={() => setQueueType('priority')}>Priority</button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="visualizer-canvas-container" style={{ minHeight: '260px' }}>
              
              {/* Circular Queue Display */}
              {currentStep.state.type === 'circular' ? (
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Render circular slots */}
                  <div style={{
                    position: 'relative',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    border: '3px dashed rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {currentStep.state.slots.map((val: number | null, idx: number) => {
                      const angle = (idx * 360) / circularCapacity;
                      const rad = (angle * Math.PI) / 180;
                      const r = 70; // radius
                      const x = r * Math.sin(rad);
                      const y = -r * Math.cos(rad);

                      const isFront = currentStep.state.front === idx;
                      const isRear = currentStep.state.rear === idx;
                      const isActive = currentStep.state.active === idx;
                      const isSuccess = currentStep.state.success === idx;

                      let nodeClass = "ds-node";
                      if (isActive) nodeClass += " active";
                      if (isSuccess) nodeClass += " success";

                      return (
                        <div 
                          key={idx} 
                          className={nodeClass}
                          style={{
                            position: 'absolute',
                            left: `calc(50% + ${x}px - 26px)`,
                            top: `calc(50% + ${y}px - 26px)`,
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            fontSize: '13px',
                            background: val === null ? 'transparent' : undefined,
                            borderStyle: val === null ? 'dashed' : 'solid',
                            borderColor: val === null ? 'rgba(255, 255, 255, 0.15)' : undefined
                          }}
                        >
                          {val !== null ? val : idx}
                          {isFront && (
                            <span style={{ position: 'absolute', top: '-18px', fontSize: '9px', color: 'var(--accent-indigo)', fontWeight: 700 }}>FRONT</span>
                          )}
                          {isRear && (
                            <span style={{ position: 'absolute', bottom: '-18px', fontSize: '9px', color: 'var(--accent-cyan)', fontWeight: 700 }}>REAR</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Linear Queue Display */
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--accent-indigo)', fontWeight: 600 }}>Front →</span>
                  
                  <div className="queue-container">
                    {currentStep.state.q.map((node: QueueNode, idx: number) => {
                      const isActive = currentStep.state.active === idx;
                      const isCompare = currentStep.state.compare === idx;
                      const isSuccess = currentStep.state.success === idx;

                      let nodeClass = "ds-node";
                      if (isActive) nodeClass += " active";
                      if (isCompare) nodeClass += " compare";
                      if (isSuccess) nodeClass += " success";

                      return (
                        <div key={idx} style={{ position: 'relative' }}>
                          <div className={nodeClass}>
                            {node.value}
                            {node.priority !== undefined && (
                              <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--accent-amber)',
                                color: '#000',
                                fontSize: '9px',
                                fontWeight: 800,
                                padding: '2px 4px',
                                borderRadius: '4px'
                              }}>
                                P{node.priority}
                              </span>
                            )}
                          </div>
                          
                          {idx === 0 && (
                            <span style={{ position: 'absolute', bottom: '-26px', left: '12px', fontSize: '9px', color: 'var(--accent-indigo)', fontWeight: 700 }}>Front</span>
                          )}
                          {idx === currentStep.state.q.length - 1 && (
                            <span style={{ position: 'absolute', bottom: '-26px', left: '14px', fontSize: '9px', color: 'var(--accent-cyan)', fontWeight: 700 }}>Rear</span>
                          )}
                        </div>
                      );
                    })}

                    {currentStep.state.q.length === 0 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', width: '120px', textAlign: 'center' }}>Empty Queue</span>
                    )}
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600 }}>← Rear</span>
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

        <CodeExecutor structureType="queue" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Side controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="number" 
              placeholder="Enqueue Value" 
              className="custom-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{ fontSize: '13px' }}
            />

            {queueType === 'priority' && (
              <input 
                type="number" 
                placeholder="Priority (e.g. 1, 2, 3)" 
                className="custom-input"
                value={priorityValue}
                onChange={e => setPriorityValue(e.target.value)}
                style={{ fontSize: '13px' }}
              />
            )}

            {queueType === 'deque' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className="control-btn" onClick={() => handleEnqueue(undefined, true)}>Add Front</button>
                  <button className="control-btn" onClick={() => handleEnqueue(undefined, false)}>Add Rear</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className="control-btn" onClick={() => handleDequeue(false)}>Rem Front</button>
                  <button className="control-btn" onClick={() => handleDequeue(true)}>Rem Rear</button>
                </div>
              </>
            ) : (
              <>
                <button className="control-btn active" onClick={() => handleEnqueue()}>Enqueue (Rear)</button>
                <button className="control-btn" onClick={() => handleDequeue()}>Dequeue (Front)</button>
              </>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="queue" />
        </div>
      </div>
    </div>
  );
};
