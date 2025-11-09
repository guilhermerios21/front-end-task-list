import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  patchTask,
  deleteTask 
} from '../services/api';
import TaskList from '../components/task/TaskList';
import type { Task, TaskCreateData, TaskUpdateData } from '../types';
import './Tasks.css';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { token, logout } = useAuth();

  // Carregar tarefas
  const loadTasks = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks(token);
      setTasks(fetchedTasks);
    } catch (error: any) {
      console.error('Erro ao carregar tarefas:', error);
      
      if (error.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
      } else {
        toast.error('Erro ao carregar tarefas');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  // Criar nova tarefa
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      toast.warning('Digite um título para a tarefa');
      return;
    }

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    setIsCreating(true);

    try {
      const taskData: TaskCreateData = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        status: 'pending',
      };

      const newTask = await createTask(taskData, token);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      toast.success('Tarefa criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      
      if (error.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
      } else {
        toast.error(error.message || 'Erro ao criar tarefa');
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Atualizar tarefa
  const handleUpdateTask = async (taskId: string, taskData: TaskUpdateData) => {
    if (!token) return;

    try {
      const updatedTask = await updateTask(taskId, taskData, token);
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      toast.success('Tarefa atualizada!');
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      
      if (error.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
      } else {
        toast.error('Erro ao atualizar tarefa');
      }
    }
  };

  // Toggle status da tarefa (usando PATCH)
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    if (!token) return;

    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    try {
      const updatedTask = await patchTask(taskId, { status: newStatus }, token);
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      toast.success(newStatus === 'completed' ? 'Tarefa concluída!' : 'Tarefa reaberta!');
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      
      if (error.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
      } else {
        toast.error('Erro ao atualizar status');
      }
    }
  };

  // Deletar tarefa
  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;

    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    try {
      await deleteTask(taskId, token);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Tarefa deletada!');
    } catch (error: any) {
      console.error('Erro ao deletar tarefa:', error);
      
      if (error.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
      } else {
        toast.error('Erro ao deletar tarefa');
      }
    }
  };

  // Estatísticas
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <div className="tasks-header">
          <h1>Minhas Tarefas</h1>
          <div className="tasks-stats">
            <div className="stat-item">
              <span className="stat-value">{tasks.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{completedTasks}</span>
              <span className="stat-label">Concluídas</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{pendingTasks}</span>
              <span className="stat-label">Pendentes</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreateTask} className="task-create-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="task-input"
              disabled={isCreating}
            />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="task-input"
              disabled={isCreating}
            />
            <button 
              type="submit" 
              className="task-create-btn"
              disabled={isCreating}
            >
              {isCreating ? 'Criando...' : '+ Adicionar'}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando tarefas...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <h3>Nenhuma tarefa encontrada</h3>
            <p>Crie sua primeira tarefa usando o formulário acima!</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggleTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;
