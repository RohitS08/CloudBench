import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import "xterm/css/xterm.css";
import './Terminal.css'
const TerminalComponent = ({socket}) => {
  const terminalRef = useRef(null);
  const xterm = useRef(null);
  // const userInput = useRef(null);

  const [prevInputs, setPrevInputs] = useState([]);
  const [currentInput, setCurrentInput] = useState("");

  useEffect(() => {
    if (!terminalRef.current) return;

    xterm.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Fira Code, monospace",
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    xterm.current.open(terminalRef.current);
    xterm.current.writeln("Welcome to Xterm.current.js in React!");
    
    xterm.current.onData((data) => {
      if (data === "\x1b[A") {
        console.log("Up Arrow Pressed");
        return;
      } else if (data === "\x1b[B") {
        console.log("Down Arrow Pressed");
        return;
      } else if (data === "\x1b[C" || data === "\x1b[D") {
        console.log("Left/Right Arrow Pressed");
        return
      }
    
      if (data === "\r") {
        xterm.current.writeln("");
        socket.timeout(3000).emit('msg', currentInput, (err, res) => {
          if(err){
          xterm.current.writeln(err);
          }else{
          xterm.current.writeln(res.op);
          }
        });
        setCurrentInput(""); 
      } else if (data === "\x7F") {
        console.log("Backspace Pressed");
        console.log(currentInput.slice(0, -1));
        if (currentInput.length > 0) {
          setCurrentInput(currentInput.slice(0, -1));
        }
      } else {
        setCurrentInput(currentInput + data);
      }
    });

    return () => {
      xterm.current.dispose();
    };
  }, []);

  useEffect(() => {
    xterm.current.write("");
    xterm.current.write(currentInput);
  }, [currentInput]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "100px", // ✅ Prevents 0 height issue
        backgroundColor: "black",
      }}
    />
  );
};

export default TerminalComponent;

