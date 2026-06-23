import React from 'react';
import { PlaybackControls } from '../PlaybackControls';
import type { VisualizerStep } from '../../types';

interface VisualizerLayoutProps {
  title: string;
  steps: VisualizerStep[];
  currentStepIndex: number;
  setCurrentStepIndex: (i: number) => void;
  isPlaying: boolean;
  setIsPlaying: (b: boolean) => void;
  speed: number;
  setSpeed: (s: number) => void;
  // optional explanation rendered in playback controls
  explanation?: string;
  // visual content (canvas) supplied by concrete visualizer
  children: React.ReactNode;
}

/**
 * Common layout for all visualizer components.
 * Provides a title, a canvas container, and consistent playback controls.
 * Responsive layout is handled via CSS classes defined elsewhere.
 */
export const VisualizerLayout: React.FC<VisualizerLayoutProps> = ({
  title,
  steps,
  currentStepIndex,
  setCurrentStepIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  explanation,
  children,
}) => {
  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>{title}</h2>
            {/* Canvas container */}
            <div className="visualizer-canvas-container" style={{ minHeight: '360px', position: 'relative' }}>
              {children}
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
            explanation={explanation}
          />
        </div>
      </div>
    </div>
  );
};
