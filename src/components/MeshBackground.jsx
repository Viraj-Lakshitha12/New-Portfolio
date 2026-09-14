import React from 'react';

export default function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-700">
      <div className="mesh-blob mesh-anim-1" style={{ background: 'var(--mesh-1)' }} />
      <div className="mesh-blob mesh-anim-2" style={{ background: 'var(--mesh-2)' }} />
      <div className="mesh-blob mesh-anim-3" style={{ background: 'var(--mesh-3)' }} />
      <div className="mesh-blob mesh-anim-4" style={{ background: 'var(--mesh-4)' }} />
    </div>
  );
}