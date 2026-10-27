import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-300">Class Deadline Hub</span> © 2026. Học viện Công nghệ Bưu chính Viễn thông (PTIT).
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-slate-300 transition">Trang chủ</Link>
          <Link href="/deadlines" className="hover:text-slate-300 transition">Deadlines (ISR)</Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition">Dashboard (SSR)</Link>
          <Link href="/admin" className="hover:text-slate-300 transition">Quản trị</Link>
        </div>
      </div>
    </footer>
  );
}
