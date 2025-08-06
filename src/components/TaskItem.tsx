import React, { useState } from 'react';
import { Task, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit3, Check, X, Clock } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete, onToggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDeadline, setEditDeadline] = useState(
    task.deadline ? task.deadline.toISOString().split('T')[0] : ''
  );

  const handleSave = () => {
    const updatedTask = {
      ...task,
      text: editText,
      priority: editPriority,
      deadline: editDeadline ? new Date(editDeadline) : undefined,
    };
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditPriority(task.priority);
    setEditDeadline(task.deadline ? task.deadline.toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'terminal-text';
    }
  };

  const formatDeadline = (deadline: Date) => {
    return deadline.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="terminal-window p-4 mb-3">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 w-5 h-5 border rounded flex items-center justify-center ${
            task.completed 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border hover:border-primary'
          } transition-colors`}
        >
          {task.completed && <Check size={12} className="terminal-glow" />}
        </button>

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="terminal-input text-sm"
                placeholder="Task description..."
              />
              
              <div className="flex gap-2 flex-wrap">
                <Select value={editPriority} onValueChange={(value: Priority) => setEditPriority(value)}>
                  <SelectTrigger className="w-24 terminal-input text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high" className="text-xs">HIGH</SelectItem>
                    <SelectItem value="medium" className="text-xs">MED</SelectItem>
                    <SelectItem value="low" className="text-xs">LOW</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="terminal-input text-xs w-32"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" variant="outline" className="text-xs">
                  <Check size={12} className="mr-1" />
                  SAVE
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline" className="text-xs">
                  <X size={12} className="mr-1" />
                  CANCEL
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
                  [{task.priority.toUpperCase()}]
                </span>
                {task.deadline && (
                  <span className="text-xs terminal-text opacity-60 flex items-center gap-1">
                    <Clock size={10} />
                    {formatDeadline(task.deadline)}
                  </span>
                )}
              </div>
              
              <div className={`terminal-text ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.text}
              </div>
              
              <div className="text-xs terminal-text opacity-40 mt-1">
                ID: {task.id.slice(0, 8)} | Created: {task.createdAt.toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1">
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0"
            >
              <Edit3 size={12} />
            </Button>
            <Button
              onClick={() => onDelete(task.id)}
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 hover:bg-destructive hover:border-destructive"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;