import React, { useState, useMemo } from 'react';
import { Task, Priority, TaskFilters } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TerminalClock from './TerminalClock';
import TypingAnimation from './TypingAnimation';
import MatrixBackground from './MatrixBackground';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import TerminalCommand from './TerminalCommand';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Filter } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('hacker-tasks', []);
  const [filters, setFilters] = useState<TaskFilters>({ showCompleted: true });
  const [showTerminal, setShowTerminal] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTask = (text: string, priority: Priority, deadline?: Date) => {
    const newTask: Task = {
      id: generateId(),
      text,
      priority,
      deadline,
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const executeCommand = (command: string): string => {
    const args = command.trim().split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        return `Available commands:
> add "task description" [high|medium|low] [YYYY-MM-DD]
> delete <task_id>
> complete <task_id>
> list [completed|pending]
> clear
> help`;

      case 'add':
        const match = command.match(/add\s+"([^"]+)"(?:\s+(\w+))?(?:\s+(\d{4}-\d{2}-\d{2}))?/);
        if (match) {
          const [, text, priority = 'medium', dateStr] = match;
          const deadline = dateStr ? new Date(dateStr) : undefined;
          addTask(text, priority as Priority, deadline);
          return `✓ Task added: "${text}" [${priority.toUpperCase()}]${deadline ? ` due ${deadline.toDateString()}` : ''}`;
        }
        return '✗ Invalid syntax. Use: add "task description" [priority] [YYYY-MM-DD]';

      case 'delete':
        const deleteId = args[1];
        if (deleteId) {
          const task = tasks.find(t => t.id.startsWith(deleteId));
          if (task) {
            deleteTask(task.id);
            return `✓ Task deleted: "${task.text}"`;
          }
          return `✗ Task not found: ${deleteId}`;
        }
        return '✗ Usage: delete <task_id>';

      case 'complete':
        const completeId = args[1];
        if (completeId) {
          const task = tasks.find(t => t.id.startsWith(completeId));
          if (task) {
            toggleTaskComplete(task.id);
            return `✓ Task ${task.completed ? 'uncompleted' : 'completed'}: "${task.text}"`;
          }
          return `✗ Task not found: ${completeId}`;
        }
        return '✗ Usage: complete <task_id>';

      case 'list':
        const filter = args[1];
        let filteredTasks = tasks;
        if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);
        if (filter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
        
        if (filteredTasks.length === 0) {
          return 'No tasks found.';
        }
        
        return filteredTasks.map(t => 
          `${t.id.slice(0, 8)} | [${t.priority.toUpperCase()}] ${t.completed ? '✓' : '○'} ${t.text}`
        ).join('\n');

      case 'clear':
        return '';

      default:
        return `✗ Unknown command: ${cmd}. Type "help" for available commands.`;
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!filters.showCompleted && task.completed) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      return true;
    });
  }, [tasks, filters]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(t => 
      !t.completed && t.deadline && new Date() > t.deadline
    ).length;
    
    return { total, completed, pending, overdue };
  }, [tasks]);

  return (
    <div className="min-h-screen p-4 relative">
      <MatrixBackground />
      
      <div className="max-w-4xl mx-auto">
        <TerminalClock />
        
        <div className="terminal-window p-6 mb-6">
          <div className="text-center mb-4">
            <TypingAnimation 
              text="HACKER TASK MANAGER" 
              className="terminal-glow text-2xl md:text-4xl font-bold"
              speed={80}
            />
            <div className="terminal-text opacity-60 mt-2">
              SECURE TASK MANAGEMENT SYSTEM v2.0
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="terminal-window p-3">
              <div className="terminal-glow text-xl font-bold">{taskStats.total}</div>
              <div className="text-xs terminal-text opacity-70">TOTAL</div>
            </div>
            <div className="terminal-window p-3">
              <div className="terminal-glow text-xl font-bold">{taskStats.pending}</div>
              <div className="text-xs terminal-text opacity-70">PENDING</div>
            </div>
            <div className="terminal-window p-3">
              <div className="terminal-glow text-xl font-bold">{taskStats.completed}</div>
              <div className="text-xs terminal-text opacity-70">COMPLETE</div>
            </div>
            <div className="terminal-window p-3">
              <div className="priority-high text-xl font-bold">{taskStats.overdue}</div>
              <div className="text-xs terminal-text opacity-70">OVERDUE</div>
            </div>
          </div>
        </div>

        <TaskForm onAddTask={addTask} />

        <div className="terminal-window p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="terminal-glow text-sm font-bold">
              ═══ TASK LIST ═══
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setShowTerminal(!showTerminal)}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                TERMINAL
              </Button>
              
              <Button
                onClick={() => setFilters(prev => ({ ...prev, showCompleted: !prev.showCompleted }))}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {filters.showCompleted ? <Eye size={12} /> : <EyeOff size={12} />}
                <span className="ml-1">COMPLETED</span>
              </Button>
              
              <Select 
                value={filters.priority || 'all'} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  priority: value === 'all' ? undefined : value as Priority 
                }))}
              >
                <SelectTrigger className="w-20 terminal-input text-xs">
                  <Filter size={12} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">ALL</SelectItem>
                  <SelectItem value="high" className="text-xs">HIGH</SelectItem>
                  <SelectItem value="medium" className="text-xs">MED</SelectItem>
                  <SelectItem value="low" className="text-xs">LOW</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showTerminal && (
            <TerminalCommand 
              onExecuteCommand={executeCommand}
              className="mb-4"
            />
          )}

          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 terminal-text opacity-50">
                <div className="text-lg mb-2">NO TASKS FOUND</div>
                <div className="text-sm">
                  {tasks.length === 0 
                    ? 'Add your first task above or use terminal commands'
                    : 'Adjust filters to see more tasks'
                  }
                </div>
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  onToggleComplete={toggleTaskComplete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;