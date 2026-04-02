export type UserRole = 'student' | 'admin' | 'editor' | 'bursar' | 'lecturer' | 'registrar' | 'other';

export interface Message {
  id?: string;
  senderId: string;
  senderName: string;
  subject: string;
  content: string;
  reply?: string;
  repliedAt?: number;
  isRead: boolean;
  createdAt: number;
}

export interface Timetable {
  id: string;
  year: string;
  semester: string;
  program: string;
  url: string; // Link to PDF or image
  createdAt: number;
}

export interface Student {
  id?: string;
  uid: string;
  name: string;
  email: string;
  registrationNumber: string;
  program: 'Clinical Medicine' | 'Clinical Radiology' | 'Staff';
  role: UserRole;
  approved: boolean;
  feesRemaining?: number;
  createdAt: number;
  lastLogin?: number;
}

export interface Result {
  id: string;
  studentUid: string;
  courseName: string;
  courseCode: string;
  grade: string;
  semester: string;
  year: string;
  createdAt: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'exam' | 'notice' | 'event';
  fileUrl?: string;
  createdAt: number;
}

export interface Quote {
  text: string;
  author: string;
}
