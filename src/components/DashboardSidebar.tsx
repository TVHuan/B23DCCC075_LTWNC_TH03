'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  BookOpen,
} from 'lucide-react';
import { Role } from '@/types';

interface DashboardSidebarProps {
  userRole?: Role;
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  const navItems = [
    {
      title: 'Tất cả của tôi',
      href: '/dashboard',
      tab: 'all',
      icon: LayoutDashboard,
    },
    {
      title: 'Cần hoàn thành',
      href: '/dashboard?tab=pending',
      tab: 'pending',
      icon: Clock,
    },
    {
      title: 'Đã hoàn thành',
      href: '/dashboard?tab=completed',
      tab: 'completed',
      icon: CheckCircle2,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur shrink-0 self-start shadow-xl">
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        <Layers className="w-4 h-4 text-blue-400" />
        Điều hướng cá nhân
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === '/dashboard' && currentTab === item.tab;
          const Icon = item.icon;

          return (
            <Link
              key={item.tab}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Khu vực quản trị nếu là Admin */}
      {userRole === 'admin' && (
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Lớp trưởng (Admin)
          </div>
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
              pathname === '/admin'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-500/20'
            }`}
          >
            <Shield className="w-4 h-4 text-red-400" />
            <span>Khu vực Quản trị</span>
          </Link>
        </div>
      )}

      {/* Link tiện ích */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Truy cập nhanh
        </div>
        <Link
          href="/deadlines"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <BookOpen className="w-4 h-4 text-slate-500" />
          <span>Toàn bộ Deadline (ISR)</span>
        </Link>
      </div>
    </aside>
  );
}
