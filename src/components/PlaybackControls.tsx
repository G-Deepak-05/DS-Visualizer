import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  speed: number; // in ms
  setSpeed: (speed: number) => void;
  explanation: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrev,
  onReset,
  speed,
  setSpeed,
  explanation
}) => {
  const timerRef = useRef<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        if (currentStep < totalSteps - 1) {
          onNext();
        } else {
          setIsPlaying(false);
        }
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStep, totalSteps, speed, onNext, setIsPlaying]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Auto-update speech if currently playing/narrating
  useEffect(() => {
    if (isSpeaking) {
      speak(explanation);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [explanation]);

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Buttons Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="control-btn" 
            onClick={() => {
              stopSpeaking();
              onPrev();
            }} 
            disabled={currentStep === 0}
            title="Previous Step"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button 
            className="control-btn active" 
            onClick={() => {
              setIsPlaying(!isPlaying);
            }}
            disabled={totalSteps <= 1}
            title={isPlaying ? "Pause" : "Play Animation"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <button 
            className="control-btn" 
            onClick={() => {
              stopSpeaking();
              onNext();
            }} 
            disabled={currentStep >= totalSteps - 1}
            title="Next Step"
          >
            <ChevronRight size={18} />
          </button>

          <button 
            className="control-btn" 
            onClick={() => {
              stopSpeaking();
              onReset();
            }}
            title="Reset to Start"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Step <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{totalSteps > 0 ? currentStep + 1 : 0}</span> of {totalSteps}
        </div>

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interval:</span>
          <input 
            type="range" 
            min="200" 
            max="2000" 
            step="100" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{
              cursor: 'pointer',
              accentColor: 'var(--accent-indigo)',
              width: '100px'
            }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', width: '45px', textAlign: 'right' }}>
            {speed}ms
          </span>
        </div>
      </div>

      {/* Explanation Box */}
      {explanation && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderLeft: '3px solid var(--accent-indigo)',
          borderRadius: '4px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{ flex: 1 }}>{explanation}</div>
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speak(explanation);
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isSpeaking ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
            title={isSpeaking ? "Stop Listening" : "Listen (Text to Speech)"}
          >
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}
    </div>
  );
};
