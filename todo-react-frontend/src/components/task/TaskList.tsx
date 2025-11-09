import React from 'react';
import TaskItem from './TaskItem';
import type { Task, TaskUpdateData } from '../../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string, currentStatus: string) => Promise<void>;
  onUpdate: (taskId: string, taskData: TaskUpdateData) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onUpdate, onDelete }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status !== 'completed');

  return (
    <div className="task-list">
      {pendingTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">
            Pendentes ({pendingTasks.length})
          </h3>
          <div className="tasks-grid">
            {pendingTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">
            Concluídas ({completedTasks.length})
          </h3>
          <div className="tasks-grid">
            {completedTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
