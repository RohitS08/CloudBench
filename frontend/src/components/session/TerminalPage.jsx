import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTerminalSocket } from '../../util/useTerminalSocket';
import UsageStats from './UsageStats';

export default function TerminalSession() {
  const { id: sessionId } = useParams();
  const [metrics, setMetrics] = useState(null);
  const backendUrl = 'http://localhost:5000/session';
  const terminalRef = useTerminalSocket(sessionId, backendUrl, setMetrics);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundColor: '#1e1e1e',
      }}
    >
      <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
      <UsageStats metrics={metrics} />
    </div>
  );
}
