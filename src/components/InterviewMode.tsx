import React, { useState } from 'react';
import { Trophy, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import type { Challenge } from '../types';

interface InterviewModeProps {
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'chall-1',
    title: 'Array Index Shifting',
    category: 'array',
    difficulty: 'Easy',
    xpReward: 50,
    instructions: 'Insert value 25 at index 1 of the initial array [10, 20, 30].',
    description: 'Understand how inserting an element requires shifting subsequent items to the right.',
    initialState: [10, 20, 30],
    targetState: [10, 25, 20, 30],
    hint: 'Enter Index: 1 and Value: 25, then click Execute. Shift operations are O(n).'
  },
  {
    id: 'chall-2',
    title: 'Insert into BST Node',
    category: 'tree',
    difficulty: 'Medium',
    xpReward: 75,
    instructions: 'Insert key 40 into the Binary Search Tree. Initial tree has root 50, left child 30, and right child 70.',
    description: 'Ensure keys smaller than root go left, and keys larger go right recursively.',
    initialState: [50, 30, 70],
    targetState: 'left-right', // 40 should be right child of 30
    hint: 'Insert value 40. Since 40 < 50, it goes left. Since 40 > 30, it balances as 30\'s right child.'
  },
  {
    id: 'chall-3',
    title: 'Stack LIFO Ordering',
    category: 'stack',
    difficulty: 'Easy',
    xpReward: 50,
    instructions: 'Perform the following sequence: PUSH 10, PUSH 20, PUSH 30, POP. What is the value of the final stack?',
    description: 'Demonstrate LIFO (Last-In, First-Out) operations by executing the correct order.',
    initialState: [],
    targetState: [10, 20],
    hint: 'Push 10, then 20, then 30. The Pop removes the last item (30), leaving [10, 20].'
  }
];

export const InterviewMode: React.FC<InterviewModeProps> = ({ onAddXP }) => {
  const [activeChallIdx, setActiveChallIdx] = useState(0);
  const [userArray, setUserArray] = useState<number[]>([10, 20, 30]);
  const [userStack, setUserStack] = useState<number[]>([]);
  const [userTree, setUserTree] = useState<number[]>([50, 30, 70]);
  
  // Input fields for user response
  const [idxInput, setIdxInput] = useState('');
  const [valInput, setValInput] = useState('');
  
  // Validation status
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [feedback, setFeedback] = useState('');

  const activeChallenge = CHALLENGES[activeChallIdx];

  const handleResetChallenge = () => {
    setStatus('idle');
    setFeedback('');
    setIdxInput('');
    setValInput('');

    if (activeChallenge.id === 'chall-1') {
      setUserArray([10, 20, 30]);
    } else if (activeChallenge.id === 'chall-2') {
      setUserTree([50, 30, 70]);
    } else if (activeChallenge.id === 'chall-3') {
      setUserStack([]);
    }
  };

  // Submit action for Challenge 1 (Array)
  const handleSubmitArray = () => {
    const idx = Number(idxInput);
    const val = Number(valInput);
    
    if (isNaN(idx) || isNaN(val)) return alert("Please specify valid Index and Value inputs.");

    const temp = [...userArray];
    if (idx >= 0 && idx <= temp.length) {
      temp.splice(idx, 0, val);
      setUserArray(temp);

      // Validate target state
      const isCorrect = JSON.stringify(temp) === JSON.stringify(activeChallenge.targetState);
      if (isCorrect) {
        setStatus('success');
        setFeedback(`Correct! The elements shifted correctly. +${activeChallenge.xpReward} XP awarded.`);
        onAddXP(activeChallenge.xpReward, `Solved Challenge: ${activeChallenge.title}`, 'challenge');
      } else {
        setStatus('failed');
        setFeedback("Incorrect final structure. Shifting was done wrong. Try resetting and playing again.");
      }
    } else {
      alert("Index out of bounds!");
    }
  };

  // Submit action for Challenge 2 (BST)
  const handleSubmitBST = () => {
    const val = Number(valInput);
    if (isNaN(val)) return alert("Enter value to insert.");

    if (val === 40) {
      const temp = [...userTree, 40];
      setUserTree(temp);
      setStatus('success');
      setFeedback(`Correct! 40 inserted as right child of 30. +${activeChallenge.xpReward} XP awarded.`);
      onAddXP(activeChallenge.xpReward, `Solved Challenge: ${activeChallenge.title}`, 'challenge');
    } else {
      setStatus('failed');
      setFeedback(`Incorrect. Key ${val} does not satisfy the challenge parameters.`);
    }
  };

  // Submit actions for Challenge 3 (Stack)
  const handleStackPush = () => {
    const val = Number(valInput);
    if (isNaN(val)) return alert("Specify value to push.");

    const temp = [...userStack, val];
    setUserStack(temp);
    setValInput('');
    checkStackResult(temp);
  };

  const handleStackPop = () => {
    if (userStack.length === 0) return alert("Stack is already empty.");
    const temp = userStack.slice(0, -1);
    setUserStack(temp);
    checkStackResult(temp);
  };

  const checkStackResult = (tempStack: number[]) => {
    const target = activeChallenge.targetState as number[];
    const isCorrect = JSON.stringify(tempStack) === JSON.stringify(target);
    if (isCorrect) {
      setStatus('success');
      setFeedback(`Success! Stack popped to correct LIFO state. +${activeChallenge.xpReward} XP awarded.`);
      onAddXP(activeChallenge.xpReward, `Solved Challenge: ${activeChallenge.title}`, 'challenge');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Left Sidebar: Challenges List */}
      <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} style={{ color: 'var(--accent-amber)' }} /> Challenge list
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CHALLENGES.map((chall, idx) => (
            <div 
              key={chall.id}
              onClick={() => {
                setActiveChallIdx(idx);
                setStatus('idle');
                setFeedback('');
                setIdxInput('');
                setValInput('');
                setUserArray([10, 20, 30]);
                setUserTree([50, 30, 70]);
                setUserStack([]);
              }}
              style={{
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeChallIdx === idx ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeChallIdx === idx ? 'var(--accent-indigo)' : 'transparent'}`,
                transition: 'var(--transition-smooth)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{chall.title}</span>
                <span className={`diff-badge ${chall.difficulty.toLowerCase()}`} style={{ fontSize: '8px', padding: '1px 5px', borderRadius: '3px' }}>
                  {chall.difficulty}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reward: {chall.xpReward} XP</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area: Interactive Sandbox Question */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{activeChallenge.title}</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Category: {activeChallenge.category.toUpperCase()}</span>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
            {activeChallenge.description}
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '4px solid var(--accent-cyan)',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px', fontWeight: 600 }}>Instructions</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{activeChallenge.instructions}</p>
          </div>

          {/* Sandbox Render Area */}
          <div className="visualizer-canvas-container" style={{ minHeight: '180px', marginBottom: '24px' }}>
            
            {activeChallenge.id === 'chall-1' && (
              <div className="array-container">
                {userArray.map((val, idx) => (
                  <div key={idx} className="array-box">
                    <div className="ds-node">{val}</div>
                    <span className="array-index">{idx}</span>
                  </div>
                ))}
              </div>
            )}

            {activeChallenge.id === 'chall-2' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div className="ds-node" style={{ borderRadius: '50%' }}>50</div>
                <div style={{ display: 'flex', gap: '60px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div className="ds-node" style={{ borderRadius: '50%', borderColor: 'var(--accent-indigo)' }}>30</div>
                    {userTree.includes(40) && <div className="ds-node success" style={{ borderRadius: '50%' }}>40</div>}
                  </div>
                  <div className="ds-node" style={{ borderRadius: '50%' }}>70</div>
                </div>
              </div>
            )}

            {activeChallenge.id === 'chall-3' && (
              <div style={{
                width: '100px',
                height: '140px',
                borderLeft: '3px solid rgba(255,255,255,0.2)',
                borderRight: '3px solid rgba(255,255,255,0.2)',
                borderBottom: '3px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 0'
              }}>
                {userStack.map((val, idx) => (
                  <div key={idx} className="ds-node" style={{ width: '70px', height: '30px', fontSize: '12px', borderRadius: '4px' }}>{val}</div>
                ))}
                {userStack.length === 0 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Empty Stack</span>}
              </div>
            )}

          </div>

          {/* Interactive controls */}
          {status === 'idle' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {activeChallenge.id === 'chall-1' && (
                <>
                  <input 
                    type="number" 
                    placeholder="Index" 
                    className="custom-input" 
                    value={idxInput} 
                    onChange={e => setIdxInput(e.target.value)}
                    style={{ width: '90px' }}
                  />
                  <input 
                    type="number" 
                    placeholder="Value" 
                    className="custom-input" 
                    value={valInput} 
                    onChange={e => setValInput(e.target.value)}
                    style={{ width: '90px' }}
                  />
                  <button className="control-btn active" onClick={handleSubmitArray}>Insert Element</button>
                </>
              )}

              {activeChallenge.id === 'chall-2' && (
                <>
                  <input 
                    type="number" 
                    placeholder="Value to Insert" 
                    className="custom-input" 
                    value={valInput} 
                    onChange={e => setValInput(e.target.value)}
                    style={{ width: '150px' }}
                  />
                  <button className="control-btn active" onClick={handleSubmitBST}>Insert BST</button>
                </>
              )}

              {activeChallenge.id === 'chall-3' && (
                <>
                  <input 
                    type="number" 
                    placeholder="Push Value" 
                    className="custom-input" 
                    value={valInput} 
                    onChange={e => setValInput(e.target.value)}
                    style={{ width: '110px' }}
                  />
                  <button className="control-btn" onClick={handleStackPush}>Push</button>
                  <button className="control-btn active" onClick={handleStackPop}>Pop</button>
                </>
              )}

              <button className="control-btn" onClick={handleResetChallenge} style={{ marginLeft: 'auto' }}>Reset</button>
            </div>
          )}

          {/* Feedback section */}
          {feedback && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '6px',
              background: status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${status === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {status === 'success' ? (
                <CheckCircle size={18} style={{ color: 'var(--accent-emerald)' }} />
              ) : (
                <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />
              )}
              <span style={{ fontSize: '13px', color: status === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{feedback}</span>
              {status === 'failed' && (
                <button className="control-btn" onClick={handleResetChallenge} style={{ fontSize: '11px', padding: '4px 8px', marginLeft: 'auto' }}>Retry</button>
              )}
            </div>
          )}
        </div>

        {/* Hint footer */}
        <div style={{
          marginTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start'
        }}>
          <HelpCircle size={16} style={{ color: 'var(--accent-indigo)', marginTop: '2px' }} />
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hint: </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{activeChallenge.hint}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
