
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  token?: string;
  profile?: {
    college: string;
    course: string;
    semester: string;
    hobbies: string;
    language: string;
    gender: string;
    personality: string;
  };
}

export interface Note {
  id: string;
  title: string;
  description: string;
  college: string;
  course: string;
  semester: string;
  subject: string;
  price: number;
  fileUrl: string; // In a real app, this is a secure signed URL or blob reference
  isFree: boolean;
  tags?: string[]; // e.g. ['Popular', 'Verified', 'New']
  previewUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  noteIds: string[];
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'NOTE' | 'BUNDLE';
  date: string;
  amount: number;
  transactionId: string;
  status: string;
}

export interface FilterState {
  college: string;
  course: string;
  semester: string;
  subject: string;
  search?: string;
  sort?: string;
}