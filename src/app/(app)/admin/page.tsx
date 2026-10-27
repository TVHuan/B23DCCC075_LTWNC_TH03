import { auth } from '@/auth';
import { getDeadlines, getSubjects } from '@/lib/db';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, Trash2, Calendar, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import AdminCreateDeadlineForm from '@/components/AdminCreateDeadlineForm';
import DeleteDeadlineButton from '@/components/DeleteDeadlineButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng Quản trị Lớp trưởng (Admin SSR) | Class Deadline Hub',
  description: 'Thêm và xoá deadline môn học cho tập thể lớp.',
  robots: {
    index: false,
    follow: false,
  },
};

// SSR: Trang quản trị thay đổi liên tục, render trên mỗi request
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();

  // Defense in Depth (Tự bảo vệ tầng Page Component)
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (!can(session.user.role, 'create_deadline')) {
    redirect('/403');
  }

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-2">
            <Shield className="w-3.5 h-3.5" />
            Khu vực Quản trị - Chỉ dành cho Lớp trưởng
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Quản Lý Deadline Lớp Học
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Thêm mới, theo dõi và xoá các mốc deadline của tất cả môn học.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium border border-slate-800 transition self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Về Dashboard cá nhân
        </Link>
      </div>

      {/* Form thêm deadline mới */}
      <AdminCreateDeadlineForm subjects={subjects} />

      {/* Bảng danh sách deadline hiện có để xoá */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Danh sách Deadline hiện có ({deadlines.length})
          </h2>
          <span className="text-xs text-slate-400">
            Hành động xoá sẽ kích hoạt On-demand ISR
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Môn học</th>
                <th className="py-3 px-4">Tiêu đề deadline</th>
                <th className="py-3 px-4">Hạn chót</th>
                <th className="py-3 px-4">Mức độ</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deadlines.map((dl) => {
                const sub = subjects.find((s) => s.slug === dl.subjectSlug);
                return (
                  <tr key={dl.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${sub?.badgeBg}`}>
                        {sub?.code || dl.subjectSlug}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/deadlines/${dl.id}`}
                        className="font-semibold text-white hover:text-blue-400 transition"
                      >
                        {dl.title}
                      </Link>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {dl.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium whitespace-nowrap">
                      {new Date(dl.dueDate).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">
                        {dl.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <DeleteDeadlineButton id={dl.id} title={dl.title} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
