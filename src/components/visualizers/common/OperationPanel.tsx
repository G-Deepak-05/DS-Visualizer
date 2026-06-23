import React from 'react';

type InputConfig = {
  label: string;
  type: 'number' | 'text';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type ButtonConfig = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  // optional class to mark active/important buttons
  className?: string;
};

interface OperationPanelProps {
  inputs: InputConfig[];
  buttons: ButtonConfig[];
}

/**
 * Renders a consistent set of inputs and action buttons for a visualizer.
 * Each visualizer defines its own input bindings and button callbacks.
 */
export const OperationPanel: React.FC<OperationPanelProps> = ({ inputs, buttons }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Render inputs in pairs when possible */}
        {inputs.map((cfg, idx) => (
          <input
            key={idx}
            type={cfg.type}
            placeholder={cfg.placeholder}
            className="custom-input"
            value={cfg.value}
            onChange={cfg.onChange}
            style={{ fontSize: '13px' }}
          />
        ))}
        {/* Render buttons in a grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {buttons.map((b, idx) => (
            <button
              key={idx}
              className={`control-btn ${b.variant === 'primary' ? 'active' : ''} ${b.className || ''}`.trim()}
              onClick={b.onClick}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
