import React from 'react';

export default function UsageStats({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(30,30,30,0.85)',
      color: '#f1f1f1',
      padding: '10px 14px',
      fontSize: '13px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
      pointerEvents: 'none',
      zIndex: 9999,
      lineHeight: 1.5,
    }}>
      <div>🧠 CPU: {metrics.cpuPercent}% of {metrics.cpuLimit}</div>
      <div>💾 RAM: {metrics.memUsed} / {metrics.memLimit} ({metrics.memPercent}%)</div>
    </div>
  );
}
