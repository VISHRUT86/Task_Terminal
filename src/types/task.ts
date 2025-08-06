export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  deadline?: Date;
  createdAt: Date;
}

export interface TaskFilters {
  showCompleted: boolean;
  priority?: Priority;
}