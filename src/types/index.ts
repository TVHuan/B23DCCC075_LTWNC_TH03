export type Role = 'admin' | 'user' | 'guest';

export type Action = 'view_deadline' | 'mark_completed' | 'create_deadline' | 'delete_deadline';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
}

export interface Subject {
  id: string;
  slug: string;
  code: string;
  name: string;
  description: string;
  instructor: string;
  credits: number;
  color: string;
  badgeBg: string;
  accentColor: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Deadline {
  id: string;
  subjectSlug: string;
  title: string;
  description: string;
  dueDate: string; // ISO 8601 string
  priority: Priority;
  submissionUrl?: string;
  createdAt: string;
}

export interface DeadlineWithSubject extends Deadline {
  subject?: Subject;
  isCompleted?: boolean;
}

export interface CompletionRecord {
  userId: string;
  deadlineId: string;
  completedAt: string;
}
