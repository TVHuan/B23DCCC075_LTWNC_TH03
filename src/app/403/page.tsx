import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '403 - Bị từ chối truy cập | Class Deadline Hub',
  description: 'Bạn không có quyền truy cập vào tài nguyên quản trị này.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/80 border border-red-500/30 rounded-2xl p-8 backdrop-blur shadow-2xl text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-5 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
          Lỗi 403 Forbidden
        </span>

        <h1 className="text-2xl font-bold text-white mb-2">
          Truy cập bị từ chối
        </h1>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Khu vực <code className="text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded text-xs">/admin</code> chỉ dành riêng cho <strong>Lớp trưởng (Admin)</strong>. Tài khoản sinh viên hiện tại của bạn không đủ quyền hạn để thực hiện thao tác này.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-600/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            Về trang cá nhân (Dashboard)
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
          >
            <Home className="w-4 h-4" />
            Quay về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
