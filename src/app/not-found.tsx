import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur shadow-2xl text-center">
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
          <FileQuestion className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 bg-slate-800 text-slate-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
          404 Not Found
        </span>

        <h1 className="text-2xl font-bold text-white mb-2">
          Không tìm thấy trang hoặc Deadline
        </h1>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Tài nguyên bạn đang tìm kiếm không tồn tại, đã bị xoá hoặc đường dẫn không chính xác.
        </p>

        <div className="space-y-3">
          <Link
            href="/deadlines"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Xem danh sách Deadline
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
          >
            <Home className="w-4 h-4" />
            Về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
