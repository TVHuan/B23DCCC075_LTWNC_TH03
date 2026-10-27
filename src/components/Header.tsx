import Link from 'next/link';
import { auth } from '@/auth';
import UserNav from './UserNav';
import { CalendarCheck, BookOpen, Clock, LogIn } from 'lucide-react';

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-none tracking-tight">
                Class Deadline Hub
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Cổng deadline lớp PTIT
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300">
            <Link
              href="/deadlines"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Tất cả Deadline
            </Link>
            <div className="h-4 w-[1px] bg-slate-800 mx-1" />
            <Link
              href="/subjects/ltwnc"
              className="px-2.5 py-1 rounded-lg hover:text-white hover:bg-slate-900 transition text-slate-400"
            >
              LTW Nâng cao
            </Link>
            <Link
              href="/subjects/cnpm"
              className="px-2.5 py-1 rounded-lg hover:text-white hover:bg-slate-900 transition text-slate-400"
            >
              CN Phần mềm
            </Link>
            <Link
              href="/subjects/csdlpt"
              className="px-2.5 py-1 rounded-lg hover:text-white hover:bg-slate-900 transition text-slate-400"
            >
              CSDL Phân tán
            </Link>
            <Link
              href="/subjects/anbm"
              className="px-2.5 py-1 rounded-lg hover:text-white hover:bg-slate-900 transition text-slate-400"
            >
              An toàn & BM
            </Link>
          </nav>
        </div>

        {/* Auth / Profile Area */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserNav user={session.user} />
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
