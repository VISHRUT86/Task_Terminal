import React, { useState } from 'react';
import { Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (text: string, priority: Priority, deadline?: Date) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddTask(
      text.trim(),
      priority,
      deadline ? new Date(deadline) : undefined
    );
    
    setText('');
    setDeadline('');
    setPriority('medium');
  };

  return (
    <div className="terminal-window p-4 mb-6">
      <div className="terminal-glow text-sm font-bold mb-3">
        ═══ ADD NEW TASK ═══
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task description..."
          className="terminal-input"
          required
        />
        
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-24">
            <label className="text-xs terminal-text opacity-70 block mb-1">PRIORITY</label>
            <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
              <SelectTrigger className="terminal-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">HIGH</SelectItem>
                <SelectItem value="medium">MEDIUM</SelectItem>
                <SelectItem value="low">LOW</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-32">
            <label className="text-xs terminal-text opacity-70 block mb-1">DEADLINE</label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="terminal-input"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" variant="outline">
          <Plus size={16} className="mr-2" />
          ADD TASK
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;