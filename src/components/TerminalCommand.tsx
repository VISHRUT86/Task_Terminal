import React, { useState } from 'react';
import { Task, Priority } from '@/types/task';

interface TerminalCommandProps {
  onExecuteCommand: (command: string) => string;
  className?: string;
}

const TerminalCommand: React.FC<TerminalCommandProps> = ({ onExecuteCommand, className = "" }) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([
    '> HACKER TASK MANAGER v2.0 INITIALIZED',
    '> Type "help" for available commands',
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const result = onExecuteCommand(command);
    setHistory(prev => [...prev, `> ${command}`, result]);
    setCommand('');
  };

  return (
    <div className={`terminal-window p-4 ${className}`}>
      <div className="mb-3">
        <div className="terminal-glow text-sm font-bold mb-2">
          ═══ COMMAND TERMINAL ═══
        </div>
        <div className="bg-muted p-3 rounded max-h-32 overflow-y-auto">
          {history.map((line, index) => (
            <div key={index} className="terminal-text text-xs leading-relaxed">
              {line}
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <span className="terminal-glow text-sm">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="terminal-input flex-1 px-2 py-1 text-sm rounded"
          placeholder="Enter command..."
          autoComplete="off"
        />
      </form>
      
      <div className="text-xs terminal-text opacity-60 mt-2">
        Commands: add "task" [priority] [deadline] | delete &lt;id&gt; | complete &lt;id&gt; | list | help
      </div>
    </div>
  );
};

export default TerminalCommand;