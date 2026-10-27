import { getSubjects, getDeadlines } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, CheckCircle2, ShieldCheck, Flame, Calendar, Sparkles } from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ | Class Deadline Hub',
  description: 'Cổng thông tin và lịch trình nộp deadline của lớp - Tự động cập nhật và phân quyền theo vai trò.',
};

// SSG: Mặc định không có dynamic headers hay force-dynamic nên Next.js sẽ sinh trang tĩnh lúc build
export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  const now = new Date().getTime();
  const upcomingDeadlines = deadlines.filter(
    (d) => new Date(d.dueDate).getTime() >= now
  );

  return (
    <div className="relative overflow-hidden pb-16">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Học kỳ 1 - Năm học 2026-2027 • Lớp Lập trình Web nâng cao
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Cổng Quản Lý & Theo Dõi <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Deadline Lớp Học Thời Gian Thực
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tra cứu hạn nộp bài tập, đồ án và tài liệu hướng dẫn của tất cả các môn học. Sinh viên đăng nhập để đánh dấu tiến độ hoàn thành cá nhân.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/deadlines"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/25 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Xem toàn bộ Deadline
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold text-sm transition"
          >
            Đăng nhập sinh viên
          </Link>
        </div>

        {/* Quick Stats Banner */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Môn học kỳ này</div>
          </div>
          <div className="p-3 text-center border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{deadlines.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Tổng số Deadline</div>
          </div>
          <div className="p-3 text-center border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{upcomingDeadlines.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Sắp tới hạn</div>
          </div>
          <div className="p-3 text-center border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Render SSG / ISR</div>
          </div>
        </div>
      </section>

      {/* 4 Môn học Section (SSG routes) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Các môn học phụ trách
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Nhấp vào môn học để xem danh sách deadline tương ứng (Rendered with SSG)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {subjects.map((sub) => {
            const count = deadlines.filter((d) => d.subjectSlug === sub.slug).length;
            return (
              <Link
                key={sub.slug}
                href={`/subjects/${sub.slug}`}
                className="group p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${sub.badgeBg}`}>
                      {sub.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {sub.credits} tín chỉ
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition leading-snug">
                    {sub.name}
                  </h3>

                  <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    GV: {sub.instructor}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[11px]">
                    {count} deadline
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Deadline sắp tới gần nhất (Next upcoming) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Deadline cần chú ý nhất
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Các bài tập và mốc báo cáo gần nhất cần ưu tiên thực hiện
            </p>
          </div>

          <Link
            href="/deadlines"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          >
            Xem tất cả
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {deadlines.slice(0, 3).map((dl) => {
            const subject = subjects.find((s) => s.slug === dl.subjectSlug);
            return (
              <div
                key={dl.id}
                className="p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl transition duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${subject?.badgeBg}`}>
                      {subject?.code}
                    </span>
                    <CountdownBadge dueDate={dl.dueDate} />
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug mb-2">
                    <Link href={`/deadlines/${dl.id}`} className="hover:text-blue-400 transition">
                      {dl.title}
                    </Link>
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {dl.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(dl.dueDate).toLocaleDateString('vi-VN')}
                  </span>

                  <Link
                    href={`/deadlines/${dl.id}`}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
