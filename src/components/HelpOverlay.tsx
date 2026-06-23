import React, { useState } from 'react';
import type { Annotation } from '../types';

interface HelpOverlayProps {
  annotations: Annotation[];
  onClose: () => void;
  onChange: (ann: Annotation[]) => void;
}

export const HelpOverlay: React.FC<HelpOverlayProps> = ({ annotations, onClose, onChange }) => {
  const [adding, setAdding] = useState(false);
  const [newAnn, setNewAnn] = useState<Partial<Annotation>>({});

  // Helper to get absolute position of a selector element relative to the overlay container
  const getPos = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const overlayRect = document
      .getElementById('help-overlay-root')!
      .getBoundingClientRect();
    return {
      top: rect.top - overlayRect.top,
      left: rect.left - overlayRect.left,
    };
  };

  const handleAdd = () => {
    if (!newAnn.id || !newAnn.selector || !newAnn.text) return;
    const updated = [...annotations, newAnn as Annotation];
    onChange(updated);
    setNewAnn({});
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = annotations.filter(a => a.id !== id);
    onChange(updated);
  };

  return (
    <div
      id="help-overlay-root"
      className="help-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0.1)',
      }}
    >
      {/* Render annotations */}
      {annotations.map(a => {
        const pos = getPos(a.selector);
        if (!pos) return null;
        return (
          <div
            key={a.id}
            className="annotation-box"
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              color: a.color || '#fff',
              pointerEvents: 'auto',
            }}
          >
            <div className="annotation-text" style={{ background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px' }}>
              {a.text}
            </div>
            {/* Simple arrow using CSS */}
            <div
              className="annotation-arrow"
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${a.color || '#fff'}`,
                margin: '4px auto 0',
              }}
            />
            <button
              onClick={() => handleDelete(a.id)}
              style={{
                marginTop: '2px',
                fontSize: '10px',
                pointerEvents: 'auto',
              }}
              aria-label="Delete annotation"
            >
              ✕
            </button>
          </div>
        );
      })}

      {/* Controls – allow pointer events via a small container */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          pointerEvents: 'auto',
          display: 'flex',
          gap: '8px',
        }}
      >
        <button onClick={() => setAdding(!adding)}>Add Annotation</button>
        <button onClick={onClose}>Close</button>
      </div>

      {adding && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 10,
            background: '#222',
            padding: '8px',
            borderRadius: '4px',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ marginBottom: '4px' }}>
            <input
              placeholder="CSS selector"
              value={newAnn.selector || ''}
              onChange={e => setNewAnn({ ...newAnn, selector: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <input
              placeholder="Text"
              value={newAnn.text || ''}
              onChange={e => setNewAnn({ ...newAnn, text: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <input
              placeholder="Arrow (top/right/bottom/left)"
              value={newAnn.arrow || ''}
              onChange={e => setNewAnn({ ...newAnn, arrow: e.target.value as any })}
            />
          </div>
          <button onClick={handleAdd}>Save</button>
        </div>
      )}
    </div>
  );
};
