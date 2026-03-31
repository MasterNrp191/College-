export type UserRole = 'student' | 'admin' | 'editor';

export interface Student {
  id?: string;
  uid: string;
  name: string;
  email: string;
  registrationNumber: string;
  program: 'Clinical Medicine' | 'Clinical Radiology';
  role: UserRole;
  approved: boolean;
  createdAt: number;
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
  type: 'exam' | 'notice' | 'event';
  createdAt: number;
}

export interface Quote {
  text: string;
  author: string;
}
