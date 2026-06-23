import React, { useState, useEffect } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep } from '../../types';

interface StackVisualizerProps {
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ onAddXP }) => {
  const [stack, setStack] = useState<number[]>([10, 20]);
  const [inputValue, setInputValue] = useState('');

  // Simulation steps
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);

  useEffect(() => {
    resetSteps([10, 20], "Initial stack structure.");
  }, []);

  const resetSteps = (initialStack: number[], explanation: string) => {
    setSteps([
      {
        stepNumber: 1,
        explanation,
        state: { stack: [...initialStack], animType: 'none', animIdx: -1, poppedVal: null }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Push
  const handlePush = (valParam?: number) => {
    const val = valParam !== undefined ? valParam : Number(inputValue);
    if (isNaN(val)) return alert("Please specify a valid value to Push.");
    if (stack.length >= 5) return alert("Stack overflow! Max size in this playground is 5.");

    const newSteps: VisualizerStep[] = [];
    const currentStack = [...stack];

    // Step 1: Pre-push hover
    newSteps.push({
      stepNumber: 1,
      explanation: `Attempting to PUSH ${val}. Check if stack has capacity (it is not full).`,
      state: { stack: [...currentStack], animType: 'hover-push', animIdx: -1, newVal: val }
    });

    // Step 2: Push and fall
    const updated = [...currentStack, val];
    newSteps.push({
      stepNumber: 2,
      explanation: `Pushing ${val} onto top of the stack. New node falls from top.`,
      state: { stack: updated, animType: 'push', animIdx: updated.length - 1 }
    });

    setSteps(newSteps);
    setStack(updated);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, `Push ${val} onto Stack`, 'visualization');
  };

  // Pop
  const handlePop = () => {
    if (stack.length === 0) return alert("Stack underflow! Stack is empty.");

    const newSteps: VisualizerStep[] = [];
    const currentStack = [...stack];
    const poppedVal = currentStack[currentStack.length - 1];

    // Step 1: Highlight top
    newSteps.push({
      stepNumber: 1,
      explanation: `Identify current top node (value: ${poppedVal}) to prepare for POP.`,
      state: { stack: [...currentStack], animType: 'peek', animIdx: currentStack.length - 1 }
    });

    // Step 2: Pop out upwards
    const updated = currentStack.slice(0, -1);
    newSteps.push({
      stepNumber: 2,
      explanation: `Popping top node (value: ${poppedVal}) from stack. Top element moves upward.`,
      state: { stack: updated, animType: 'pop', animIdx: currentStack.length - 1, poppedVal }
    });

    setSteps(newSteps);
    setStack(updated);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(15, 'Pop Stack', 'visualization');
  };

  // Peek
  const handlePeek = () => {
    if (stack.length === 0) return alert("Stack is empty! Cannot peek.");

    const topVal = stack[stack.length - 1];
    setSteps([
      {
        stepNumber: 1,
        explanation: `Peeking top of stack... Top element is ${topVal}. Stack structure remains unmodified.`,
        state: { stack: [...stack], animType: 'peek', animIdx: stack.length - 1 }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(10, 'Peek Stack', 'visualization');
  };

  // Is Empty
  const handleIsEmpty = () => {
    const empty = stack.length === 0;
    setSteps([
      {
        stepNumber: 1,
        explanation: `Check if stack size is 0. Current size: ${stack.length}. Stack is ${empty ? 'EMPTY' : 'NOT EMPTY'}.`,
        state: { stack: [...stack], animType: 'none', animIdx: -1, checkEmpty: true }
      }
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(10, 'Check Stack IsEmpty', 'visualization');
  };

  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    let tempStack = [...stack];
    const generatedSteps: VisualizerStep[] = [];
    let currentStepNumber = 1;

    commands.forEach((cmd) => {
      const { action, params } = cmd;
      if (action === 'push') {
        const val = Number(params[0]);
        if (!isNaN(val) && tempStack.length < 5) {
          tempStack.push(val);
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: push ${val}.`,
            state: { stack: [...tempStack], animType: 'push', animIdx: tempStack.length - 1 }
          });
        }
      } else if (action === 'pop') {
        if (tempStack.length > 0) {
          const popped = tempStack.pop();
          generatedSteps.push({
            stepNumber: currentStepNumber++,
            explanation: `Code run: pop (removed top value: ${popped}).`,
            state: { stack: [...tempStack], animType: 'none', animIdx: -1 }
          });
        }
      }
    });

    if (generatedSteps.length > 0) {
      setStack(tempStack);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      onAddXP(25, 'Run Custom Stack Script', 'visualization');
    }
  };

  const currentStep = steps[currentStepIndex] || {
    state: { stack, animType: 'none', animIdx: -1, poppedVal: null },
    explanation: ""
  };
  const activeStack = currentStep.state.stack;

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Stack Visualizer</h2>

            {/* Visualizer container */}
            <div className="visualizer-canvas-container" style={{ minHeight: '360px', position: 'relative' }}>
              
              {/* Pop Animation Node Float */}
              {currentStep.state.animType === 'pop' && currentStep.state.poppedVal !== null && (
                <div 
                  className="ds-node animate-pop-up" 
                  style={{
                    position: 'absolute',
                    top: '60px',
                    borderColor: 'var(--accent-rose)'
                  }}
                >
                  {currentStep.state.poppedVal}
                </div>
              )}

              {/* Push hover indicator */}
              {currentStep.state.animType === 'hover-push' && currentStep.state.newVal !== undefined && (
                <div 
                  className="ds-node" 
                  style={{
                    position: 'absolute',
                    top: '20px',
                    opacity: 0.6,
                    borderStyle: 'dashed',
                    borderColor: 'var(--accent-indigo)'
                  }}
                >
                  {currentStep.state.newVal}
                </div>
              )}

              {/* Stack Beaker shape container */}
              <div style={{
                width: '120px',
                height: '240px',
                borderLeft: '4px solid rgba(255, 255, 255, 0.2)',
                borderRight: '4px solid rgba(255, 255, 255, 0.2)',
                borderBottom: '4px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0 0 16px 16px',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px',
                padding: '12px 0',
                background: 'rgba(255, 255, 255, 0.01)',
                position: 'relative'
              }}>
                {activeStack.map((val: number, idx: number) => {
                  const isTop = idx === activeStack.length - 1;
                  const isPushAnim = currentStep.state.animType === 'push' && isTop;
                  const isPeekAnim = currentStep.state.animType === 'peek' && isTop;

                  let nodeClass = "ds-node";
                  if (isPushAnim) nodeClass += " animate-fall";
                  if (isPeekAnim) nodeClass += " active pulse-glow";

                  return (
                    <div 
                      key={idx} 
                      className={nodeClass}
                      style={{
                        width: '80px',
                        height: '42px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, var(--bg-tertiary), rgba(30, 41, 59, 0.8))'
                      }}
                    >
                      {val}
                      {isTop && (
                        <span style={{
                          position: 'absolute',
                          right: '-46px',
                          color: 'var(--accent-cyan)',
                          fontSize: '11px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)'
                        }}>
                          ← Top
                        </span>
                      )}
                    </div>
                  );
                })}

                {activeStack.length === 0 && (
                  <span style={{
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    textAlign: 'center',
                    marginTop: '90px'
                  }}>
                    Empty Stack
                  </span>
                )}
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

        <CodeExecutor structureType="stack" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="number" 
              placeholder="Push Value" 
              className="custom-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{ fontSize: '13px' }}
            />

            <button className="control-btn active" onClick={() => handlePush()}>Push (LIFO)</button>
            <button className="control-btn" onClick={handlePop}>Pop (LIFO)</button>
            <button className="control-btn" onClick={handlePeek}>Peek (Top)</button>
            <button className="control-btn" onClick={handleIsEmpty}>IsEmpty</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="stack" />
        </div>
      </div>
    </div>
  );
};
