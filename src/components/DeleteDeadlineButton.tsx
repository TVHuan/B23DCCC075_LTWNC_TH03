'use client';

import { useState, useTransition } from 'react';
import { deleteDeadlineAction } from '@/actions/deadlineActions';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteDeadlineButtonProps {
  id: string;
  title: string;
}

export default function DeleteDeadlineButton({ id, title }: DeleteDeadlineButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    startTransition(async () => {
      const res = await deleteDeadlineAction(id);
      if (!res.success) {
        alert(res.error || 'Lỗi khi xóa deadline');
        setIsConfirming(false);
      }
    });
  };

  if (isConfirming) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Xác nhận xoá'}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
        >
          Huỷ
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title={`Xoá deadline: ${title}`}
      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
