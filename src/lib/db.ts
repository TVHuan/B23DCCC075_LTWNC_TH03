import fs from 'fs/promises';
import path from 'path';
import { User, Subject, Deadline, CompletionRecord } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    throw error;
  }
}

// USERS
export async function getUsers(): Promise<User[]> {
  return readJsonFile<User[]>('users.json');
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

// SUBJECTS
export async function getSubjects(): Promise<Subject[]> {
  return readJsonFile<Subject[]>('subjects.json');
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug) || null;
}

// DEADLINES
export async function getDeadlines(): Promise<Deadline[]> {
  const list = await readJsonFile<Deadline[]>('deadlines.json');
  // Sắp xếp theo hạn nộp tăng dần (sắp xếp tự nhiên theo thời gian)
  return list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const deadlines = await getDeadlines();
  return deadlines.find((d) => d.id === id) || null;
}

export async function getDeadlinesBySubject(subjectSlug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectSlug === subjectSlug);
}

export async function createDeadline(
  data: Omit<Deadline, 'id' | 'createdAt'>
): Promise<Deadline> {
  const deadlines = await readJsonFile<Deadline[]>('deadlines.json');
  const newId = `dl-${Date.now()}`;
  const newDeadline: Deadline = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  deadlines.push(newDeadline);
  await writeJsonFile('deadlines.json', deadlines);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await readJsonFile<Deadline[]>('deadlines.json');
  const index = deadlines.findIndex((d) => d.id === id);
  if (index === -1) return false;

  deadlines.splice(index, 1);
  await writeJsonFile('deadlines.json', deadlines);

  // Xóa luôn các bản ghi completions liên quan
  const completions = await readJsonFile<CompletionRecord[]>('completions.json');
  const filtered = completions.filter((c) => c.deadlineId !== id);
  await writeJsonFile('completions.json', filtered);

  return true;
}

// COMPLETIONS
export async function getUserCompletions(userId: string): Promise<CompletionRecord[]> {
  const completions = await readJsonFile<CompletionRecord[]>('completions.json');
  return completions.filter((c) => c.userId === userId);
}

export async function toggleDeadlineCompletion(
  userId: string,
  deadlineId: string
): Promise<{ completed: boolean }> {
  const completions = await readJsonFile<CompletionRecord[]>('completions.json');
  const index = completions.findIndex(
    (c) => c.userId === userId && c.deadlineId === deadlineId
  );

  if (index >= 0) {
    completions.splice(index, 1);
    await writeJsonFile('completions.json', completions);
    return { completed: false };
  } else {
    completions.push({
      userId,
      deadlineId,
      completedAt: new Date().toISOString(),
    });
    await writeJsonFile('completions.json', completions);
    return { completed: true };
  }
}
