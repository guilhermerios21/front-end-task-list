import React, { useState } from 'react';
import type { Task, TaskUpdateData } from '../../types';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: (taskId: string, taskData: TaskUpdateData) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleToggle = () => {
    onToggle(task._id, !task.completed);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      return;
    }

    onUpdate(task._id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      completed: task.completed,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="task-edit-input"
          placeholder="Título"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="task-edit-textarea"
          placeholder="Descrição (opcional)"
          rows={2}
        />
        <div className="task-edit-actions">
          <button onClick={handleSaveEdit} className="btn-save">
            ✓ Salvar
          </button>
          <button onClick={handleCancelEdit} className="btn-cancel">
            ✗ Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="task-checkbox"
        />
        <div className="task-text">
          <h4 className="task-title">{task.title}</h4>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="btn-edit"
          title="Editar"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className="btn-delete"
          title="Deletar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
