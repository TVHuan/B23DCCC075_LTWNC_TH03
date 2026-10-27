'use client';

import { useState, useTransition } from 'react';
import { toggleCompleteAction } from '@/actions/deadlineActions';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface MarkCompleteButtonProps {
  deadlineId: string;
  initialCompleted: boolean;
  disabled?: boolean;
}

export default function MarkCompleteButton({
  deadlineId,
  initialCompleted,
  disabled = false,
}: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (disabled || isPending) return;

    startTransition(async () => {
      // Optimistic update
      const nextState = !completed;
      setCompleted(nextState);

      const res = await toggleCompleteAction(deadlineId);
      if (!res.success) {
        // Rollback nếu có lỗi
        setCompleted(!nextState);
        alert(res.error || 'Có lỗi xảy ra khi cập nhật!');
      } else if (res.completed !== undefined) {
        setCompleted(res.completed);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || isPending}
      title={
        disabled
          ? 'Đăng nhập để đánh dấu hoàn thành'
          : completed
          ? 'Đánh dấu chưa xong'
          : 'Đánh dấu đã hoàn thành'
      }
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer disabled:cursor-not-allowed ${
        completed
          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      ) : completed ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <Circle className="w-4 h-4 text-slate-400" />
      )}
      <span>{completed ? 'Đã xong' : 'Chưa xong'}</span>
    </button>
  );
}
