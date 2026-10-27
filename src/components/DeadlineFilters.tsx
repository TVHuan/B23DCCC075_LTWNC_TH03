'use client';

import { useState, useMemo } from 'react';
import { Subject, DeadlineWithSubject } from '@/types';
import { Search, Filter, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import CountdownBadge from './CountdownBadge';
import MarkCompleteButton from './MarkCompleteButton';

interface DeadlineFiltersProps {
  initialDeadlines: DeadlineWithSubject[];
  subjects: Subject[];
  isLoggedIn?: boolean;
}

export default function DeadlineFilters({
  initialDeadlines,
  subjects,
  isLoggedIn = false,
}: DeadlineFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filtered = useMemo(() => {
    return initialDeadlines.filter((item) => {
      // 1. Lọc theo search
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.subject?.name.toLowerCase().includes(search.toLowerCase()) ||
        item.subject?.code.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Lọc theo môn học
      if (selectedSubject !== 'all' && item.subjectSlug !== selectedSubject) {
        return false;
      }

      // 3. Lọc theo priority
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }

      // 4. Lọc theo trạng thái
      if (selectedStatus === 'completed' && !item.isCompleted) return false;
      if (selectedStatus === 'pending' && item.isCompleted) return false;

      return true;
    });
  }, [initialDeadlines, search, selectedSubject, selectedPriority, selectedStatus]);

  const priorityLabels = {
    high: { text: 'Cao', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
    medium: { text: 'Trung bình', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    low: { text: 'Thấp', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm deadline, mã môn, từ khóa..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Lọc theo môn */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo mức độ ưu tiên */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="all">Tất cả mức độ ưu tiên</option>
              <option value="high">Ưu tiên Cao</option>
              <option value="medium">Ưu tiên Trung bình</option>
              <option value="low">Ưu tiên Thấp</option>
            </select>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Tìm thấy <strong className="text-white">{filtered.length}</strong> / {initialDeadlines.length} deadline
            </span>
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  selectedStatus === 'all' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('pending')}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  selectedStatus === 'pending' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Chưa xong
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('completed')}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  selectedStatus === 'completed' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Đã xong
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid danh sách Deadline */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Không tìm thấy deadline phù hợp</h3>
          <p className="text-slate-400 text-sm mt-1">
            Hãy thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between bg-slate-900/80 border rounded-2xl p-5 hover:border-slate-700 transition duration-200 group shadow-lg ${
                item.isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header card: Subject badge & Countdown */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Link
                    href={`/subjects/${item.subjectSlug}`}
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition hover:opacity-80 ${
                      item.subject?.badgeBg || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.subject?.code || item.subjectSlug.toUpperCase()}
                  </Link>

                  <CountdownBadge dueDate={item.dueDate} isCompleted={item.isCompleted} />
                </div>

                {/* Tiêu đề & Link chi tiết */}
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug mb-2">
                  <Link href={`/deadlines/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hạn: {new Date(item.dueDate).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      priorityLabels[item.priority]?.class || ''
                    }`}
                  >
                    {priorityLabels[item.priority]?.text || item.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <MarkCompleteButton
                    deadlineId={item.id}
                    initialCompleted={!!item.isCompleted}
                    disabled={!isLoggedIn}
                  />

                  <Link
                    href={`/deadlines/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition"
                  >
                    Chi tiết
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
