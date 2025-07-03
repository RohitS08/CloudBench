import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css';

export function useTerminalSocket(sessionId, backendUrl, setMetrics) {
    const terminalRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        // Initialize terminal
        const term = new Terminal({
            cols: 80,
            rows: 24,
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#f1f1f1',
            },
            // disableStdinEcho: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        const viewport = terminalRef.current?.querySelector('.xterm-viewport');
        if (viewport) {
            viewport.style.overflowY = 'hidden';
        }

        setTimeout(() => {
            fitAddon.fit(); // More accurate after layout
        }, 10);

        // Connect socket to backend session namespace
        const socket = io(`${import.meta.env.VITE_API_URL}/session`, {
            transports: ['websocket'], // force websocket for lower latency
        });

        socketRef.current = socket;

        term.write("Welcome to Cloud Terminal - ID(" + sessionId + ")\r\n");

        socket.on('connect', () => {
            socket.emit('start-session', { sessionId });
        });

        socket.on('output', (data) => {
            term.write(data);
        });

        // Send terminal input to backend
        term.onData((data) => {
            // if (data.charCodeAt(0) === 13) {  // Enter key
            //     term.write('\r');
            // } else {
            //     term.write(data);
            // }
            console.log(data);
            if (data.charCodeAt(0) == 13)
                socket.emit('input', '\r');
            else
                socket.emit('input', data);
        });

        socket.on('error', (msg) => {
            console.error('Socket error:', msg);
            term.write(`\r\n*** ERROR: ${msg} ***\r\n`);
        });

        socket.on('disconnect', () => {
            term.write('\r\n*** Disconnected from server ***\r\n');
        });

        socket.on('metrics', (data) => {
            // console.log('[Metrics]', data);
            setMetrics?.(data);
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
            term.dispose();
        };
    }, [sessionId, backendUrl]);

    return terminalRef;
}
