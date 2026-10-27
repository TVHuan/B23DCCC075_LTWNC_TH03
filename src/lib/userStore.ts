import usersData from '@/data/users.json';
import { User } from '@/types';

const users: User[] = usersData as User[];

export async function findUserByEmail(email: string): Promise<User | null> {
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function getUsers(): Promise<User[]> {
  return users;
}
