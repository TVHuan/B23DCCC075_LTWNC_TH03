import { getDeadlines, getDeadlineById, getSubjectBySlug, getUserCompletions } from '@/lib/db';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, AlertTriangle, ExternalLink, CheckCircle2, BookOpen, Share2 } from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import type { Metadata } from 'next';

interface DeadlineDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// ISR: Sinh trước danh sách id lúc build
export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id,
  }));
}

// Dynamic Metadata cho từng Deadline
export async function generateMetadata({ params }: DeadlineDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    return {
      title: 'Không tìm thấy deadline',
    };
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const formattedDate = new Date(deadline.dueDate).toLocaleDateString('vi-VN');

  return {
    title: `${deadline.title} | ${subject?.code || ''}`,
    description: `Hạn nộp: ${formattedDate}. ${deadline.description}`,
    openGraph: {
      title: `${deadline.title} (${subject?.code || ''})`,
      description: `Hạn nộp: ${formattedDate} - ${deadline.description}`,
      type: 'article',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: deadline.title,
      description: `Hạn nộp: ${formattedDate} - ${deadline.description}`,
    },
  };
}

export default async function DeadlineDetailPage({ params }: DeadlineDetailPageProps) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const [subject, session] = await Promise.all([
    getSubjectBySlug(deadline.subjectSlug),
    auth(),
  ]);

  const userId = session?.user?.id;
  const userCompletions = userId ? await getUserCompletions(userId) : [];
  const isCompleted = userCompletions.some((c) => c.deadlineId === deadline.id);

  const priorityMeta = {
    high: { label: 'Ưu tiên Cao', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
    medium: { label: 'Ưu tiên Trung bình', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    low: { label: 'Ưu tiên Thấp', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  };

  const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // JSON-LD Structured Data: BreadcrumbList (Chuẩn yêu cầu mục E)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: `${domain}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: subject?.name || 'Môn học',
        item: `${domain}/subjects/${deadline.subjectSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.title,
        item: `${domain}/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Script JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-white transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/deadlines" className="hover:text-white transition">Deadlines</Link>
        <span>/</span>
        <Link href={`/subjects/${deadline.subjectSlug}`} className="hover:text-white transition">
          {subject?.code}
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate">{deadline.title}</span>
      </nav>

      {/* Main Content Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur shadow-2xl">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Link
              href={`/subjects/${deadline.subjectSlug}`}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition hover:opacity-80 ${
                subject?.badgeBg || 'bg-slate-800 text-slate-300'
              }`}
            >
              {subject?.code} - {subject?.name}
            </Link>

            <span
              className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                priorityMeta[deadline.priority].color
              }`}
            >
              {priorityMeta[deadline.priority].label}
            </span>
          </div>

          <CountdownBadge dueDate={deadline.dueDate} isCompleted={isCompleted} />
        </div>

        {/* Tiêu đề chính */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {deadline.title}
        </h1>

        {/* Thông tin mốc thời gian */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 block">Hạn chót nộp bài:</span>
              <strong className="text-white text-sm font-semibold">
                {new Date(deadline.dueDate).toLocaleString('vi-VN')}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 block">Ngày tạo thông báo:</span>
              <strong className="text-white text-sm font-semibold">
                {new Date(deadline.createdAt).toLocaleDateString('vi-VN')}
              </strong>
            </div>
          </div>
        </div>

        {/* Chi tiết nội dung yêu cầu */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Mô tả & Hướng dẫn thực hiện:
          </h2>
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
            {deadline.description}
          </div>
        </div>

        {/* Link nộp bài nếu có */}
        {deadline.submissionUrl && (
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Kênh nộp bài chính thức:
            </h2>
            <a
              href={deadline.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs sm:text-sm font-medium transition"
            >
              <ExternalLink className="w-4 h-4" />
              {deadline.submissionUrl}
            </a>
          </div>
        )}

        {/* Action bar: Đánh dấu hoàn thành */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MarkCompleteButton
              deadlineId={deadline.id}
              initialCompleted={isCompleted}
              disabled={!session?.user}
            />
            {!session?.user && (
              <span className="text-xs text-slate-500 italic">
                (Đăng nhập để lưu tiến độ hoàn thành)
              </span>
            )}
          </div>

          <Link
            href="/deadlines"
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}
