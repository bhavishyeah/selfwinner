import api from './api';

export interface Note {
  _id: string;
  title: string;
  description: string;
  college: string;
  course: string;
  semester: string;
  subject: string;
  price: number;
  pdfPath: string;
  status: 'active' | 'inactive';
  uploadedBy: {
    _id: string;
    email: string;
    role: string;
  };
  views: number;
  purchases: number;
  hasAccess?: boolean;
  createdAt: string;
}

export interface Bundle {
  _id: string;
  title: string;
  description: string;
  price: number;
  noteIds: Note[];
  college: string;
  course: string;
  semester: string;
  status: 'active' | 'inactive';
  createdBy: {
    _id: string;
    email: string;
    role: string;
  };
  purchases: number;
  hasAccess?: boolean;
  createdAt: string;
}

export interface NoteFilters {
  college?: string;
  course?: string;
  semester?: string;
  subject?: string;
  search?: string;
  sort?: 'price-low' | 'price-high' | 'newest';
  free?: boolean;
}

class NotesService {
  async getNotes(filters?: NoteFilters): Promise<Note[]> {
    try {
      const response = await api.get('/notes', { params: filters });
      return response.data.notes || [];
    } catch (error) {
      console.error('Get notes error:', error);
      return [];
    }
  }

  async getNote(id: string): Promise<Note | null> {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data.note;
    } catch (error) {
      console.error('Get note error:', error);
      return null;
    }
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.getNote(id);
  }

  async createNote(formData: FormData): Promise<Note | null> {
    try {
      const response = await api.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.note;
    } catch (error) {
      console.error('Create note error:', error);
      throw error;
    }
  }

  async uploadNote(formData: FormData): Promise<Note | null> {
    return this.createNote(formData);
  }

  async updateNote(id: string, data: Partial<Note>): Promise<Note | null> {
    try {
      const response = await api.put(`/notes/${id}`, data);
      return response.data.note;
    } catch (error) {
      console.error('Update note error:', error);
      return null;
    }
  }

  async deleteNote(id: string): Promise<boolean> {
    try {
      await api.delete(`/notes/${id}`);
      return true;
    } catch (error) {
      console.error('Delete note error:', error);
      return false;
    }
  }

  async checkAccess(id: string): Promise<boolean> {
    try {
      const response = await api.get(`/notes/${id}/access`);
      return response.data.hasAccess;
    } catch {
      return false;
    }
  }

  async getBundles(filters?: NoteFilters): Promise<Bundle[]> {
    try {
      const response = await api.get('/bundles', { params: filters });
      return response.data.bundles || [];
    } catch (error) {
      console.error('Get bundles error:', error);
      return [];
    }
  }

  async getBundle(id: string): Promise<Bundle | null> {
    try {
      const response = await api.get(`/bundles/${id}`);
      return response.data.bundle;
    } catch (error) {
      console.error('Get bundle error:', error);
      return null;
    }
  }

  async getBundleById(id: string): Promise<Bundle | null> {
    return this.getBundle(id);
  }

  async createBundle(data: Partial<Bundle>): Promise<Bundle | null> {
    try {
      const response = await api.post('/bundles', data);
      return response.data.bundle;
    } catch (error) {
      console.error('Create bundle error:', error);
      throw error;
    }
  }

  async updateBundle(id: string, data: Partial<Bundle>): Promise<Bundle | null> {
    try {
      const response = await api.put(`/bundles/${id}`, data);
      return response.data.bundle;
    } catch (error) {
      console.error('Update bundle error:', error);
      return null;
    }
  }

  async deleteBundle(id: string): Promise<boolean> {
    try {
      await api.delete(`/bundles/${id}`);
      return true;
    } catch (error) {
      console.error('Delete bundle error:', error);
      return false;
    }
  }

  getNotePDFUrl(id: string): string {
    const token = localStorage.getItem('token');
    return `${import.meta.env.VITE_API_URL}/api/viewer/note/${id}?token=${token}`;
  }

  async getAccessibleNotes(): Promise<Note[]> {
    try {
      const response = await api.get('/viewer/accessible-notes');
      return response.data.notes || [];
    } catch (error) {
      console.error('Get accessible notes error:', error);
      return [];
    }
  }

  async bulkImportNotes(formData: FormData): Promise<any> {
    console.warn('Bulk import not implemented yet');
    throw new Error('Bulk import feature not available');
  }

  async searchNotes(query: string): Promise<Note[]> {
    return this.getNotes({ search: query });
  }

  async filterNotes(filters: NoteFilters): Promise<Note[]> {
    return this.getNotes(filters);
  }
}

const notesService = new NotesService();
export default notesService;

// ALL EXPORTS - Every possible variation
export const getNotes = (filters?: NoteFilters) => notesService.getNotes(filters);
export const getNote = (id: string) => notesService.getNote(id);
export const getNoteById = (id: string) => notesService.getNoteById(id);
export const createNote = (formData: FormData) => notesService.createNote(formData);
export const uploadNote = (formData: FormData) => notesService.uploadNote(formData);
export const updateNote = (id: string, data: Partial<Note>) => notesService.updateNote(id, data);
export const deleteNote = (id: string) => notesService.deleteNote(id);
export const checkAccess = (id: string) => notesService.checkAccess(id);
export const getBundles = (filters?: NoteFilters) => notesService.getBundles(filters);
export const getBundle = (id: string) => notesService.getBundle(id);
export const getBundleById = (id: string) => notesService.getBundleById(id);
export const createBundle = (data: Partial<Bundle>) => notesService.createBundle(data);
export const updateBundle = (id: string, data: Partial<Bundle>) => notesService.updateBundle(id, data);
export const deleteBundle = (id: string) => notesService.deleteBundle(id);
export const getAccessibleNotes = () => notesService.getAccessibleNotes();
export const getNotePDFUrl = (id: string) => notesService.getNotePDFUrl(id);
export const bulkImportNotes = (formData: FormData) => notesService.bulkImportNotes(formData);
export const searchNotes = (query: string) => notesService.searchNotes(query);
export const filterNotes = (filters: NoteFilters) => notesService.filterNotes(filters);