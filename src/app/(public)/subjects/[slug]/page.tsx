import { getSubjects, getSubjectBySlug, getDeadlinesBySubject } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Clock, User, Award, ExternalLink } from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';
import type { Metadata } from 'next';

interface SubjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// SSG: Sinh trước danh sách slug tại thời điểm build
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((sub) => ({
    slug: sub.slug,
  }));
}

// Dynamic Metadata cho từng môn học
export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return {
      title: 'Không tìm thấy môn học',
    };
  }

  return {
    title: `${subject.code} - ${subject.name}`,
    description: subject.description,
  };
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Nút quay lại */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Trang chủ
      </Link>

      {/* Header Banner Môn học */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur mb-10 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${subject.badgeBg}`}>
            {subject.code}
          </span>
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300">
            {subject.credits} Tín chỉ
          </span>
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SSG Rendered
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {subject.name}
        </h1>

        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          {subject.description}
        </p>

        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Giảng viên: <strong className="text-white">{subject.instructor}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Tổng cộng: <strong className="text-white">{deadlines.length}</strong> deadline</span>
          </div>
        </div>
      </div>

      {/* Danh sách Deadline của môn này */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Danh sách Deadline môn {subject.code}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Theo dõi các mốc nộp bài tập, tiểu luận và đồ án môn học
        </p>
      </div>

      {deadlines.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-sm">Chưa có deadline nào cho môn học này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {deadlines.map((dl) => (
            <div
              key={dl.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Mức độ: <span className="text-white capitalize">{dl.priority}</span>
                  </span>
                  <CountdownBadge dueDate={dl.dueDate} />
                </div>

                <h3 className="font-bold text-white text-base leading-snug mb-2">
                  <Link href={`/deadlines/${dl.id}`} className="hover:text-blue-400 transition">
                    {dl.title}
                  </Link>
                </h3>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {dl.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Hạn: {new Date(dl.dueDate).toLocaleDateString('vi-VN')}
                </span>

                <Link
                  href={`/deadlines/${dl.id}`}
                  className="font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
