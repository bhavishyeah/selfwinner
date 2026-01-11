import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  isActive: boolean;
}

export interface UserProfile {
  _id?: string;
  userId: string;
  college: string;
  course: string;
  semester: string;
  hobbies?: string[];
  language?: string;
  gender?: string;
  personality?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.register(credentials);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.login(credentials);
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async logoutUser(): Promise<void> {
    return this.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  }

  async getUser(): Promise<User | null> {
    return this.getCurrentUser();
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const response = await api.get('/profile');
      if (response.data.success) {
        return response.data.profile;
      }
      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  async getProfile(): Promise<UserProfile | null> {
    return this.getUserProfile();
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await api.post('/profile', profileData);
      if (response.data.success) {
        return response.data.profile;
      }
      return null;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    return this.updateUserProfile(profileData);
  }

  async createUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    return this.updateUserProfile(profileData);
  }

  async createProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    return this.updateUserProfile(profileData);
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    const user = this.getStoredUser();
    return user?.role === 'admin';
  }

  checkAuth(): boolean {
    return this.isAuthenticated();
  }
}

const authService = new AuthService();
export default authService;

// ALL EXPORTS
export const register = (credentials: RegisterCredentials) => authService.register(credentials);
export const registerUser = (credentials: RegisterCredentials) => authService.registerUser(credentials);
export const login = (credentials: LoginCredentials) => authService.login(credentials);
export const loginUser = (credentials: LoginCredentials) => authService.loginUser(credentials);
export const logout = () => authService.logout();
export const logoutUser = () => authService.logoutUser();
export const getCurrentUser = () => authService.getCurrentUser();
export const getUser = () => authService.getUser();
export const getUserProfile = () => authService.getUserProfile();
export const getProfile = () => authService.getProfile();
export const updateUserProfile = (profileData: Partial<UserProfile>) => authService.updateUserProfile(profileData);
export const updateProfile = (profileData: Partial<UserProfile>) => authService.updateProfile(profileData);
export const createUserProfile = (profileData: Partial<UserProfile>) => authService.createUserProfile(profileData);
export const createProfile = (profileData: Partial<UserProfile>) => authService.createProfile(profileData);
export const getStoredUser = () => authService.getStoredUser();
export const getToken = () => authService.getToken();
export const isAuthenticated = () => authService.isAuthenticated();
export const isLoggedIn = () => authService.isLoggedIn();
export const isAdmin = () => authService.isAdmin();
export const checkAuth = () => authService.checkAuth();