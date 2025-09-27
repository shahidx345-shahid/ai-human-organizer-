import { create } from 'zustand';

// API base URL for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ai-human-organizer-backend.vercel.app'
  : 'http://localhost:3001';

const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projects = await response.json();
      set({ projects, loading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ error: error.message, loading: false });
    }
  },

  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const newProject = await response.json();
      set(state => ({ 
        projects: [...state.projects, newProject], 
        loading: false 
      }));
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProject: async (projectId, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      const updatedProject = await response.json();
      set(state => ({
        projects: state.projects.map(p => 
          p._id === projectId ? updatedProject : p
        ),
        loading: false
      }));
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      set(state => ({
        projects: state.projects.filter(p => p._id !== projectId),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export { useProjectStore };
