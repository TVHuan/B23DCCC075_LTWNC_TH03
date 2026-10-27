'use client';

import { signOut } from 'next-auth/react';
import { User } from '@/types';
import { LogOut, LayoutDashboard, Shield, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface UserNavProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    avatar?: string;
  };
}

export default function UserNav({ user }: UserNavProps) {
  const isAdmin = user.role === 'admin';

  return (
    <div className="flex items-center gap-3">
      {/* Vai trò Badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
        {isAdmin ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
            <Shield className="w-3.5 h-3.5 text-red-500" />
            Lớp trưởng (Admin)
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-400">
            <UserIcon className="w-3.5 h-3.5 text-blue-500" />
            Sinh viên
          </span>
        )}
      </div>

      {/* Tên người dùng */}
      <span className="text-xs text-slate-300 font-medium hidden md:inline">
        {user.name || user.email}
      </span>

      {/* Link Dashboard / Admin */}
      <Link
        href="/dashboard"
        className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-xl transition flex items-center gap-1.5"
      >
        <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>

      {isAdmin && (
        <Link
          href="/admin"
          className="px-3 py-1.5 text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 rounded-xl transition flex items-center gap-1.5"
        >
          <Shield className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Quản trị</span>
        </Link>
      )}

      {/* Nút Đăng xuất */}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        title="Đăng xuất khỏi hệ thống"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Đăng xuất</span>
      </button>
    </div>
  );
}
