'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CountdownBadgeProps {
  dueDate: string;
  isCompleted?: boolean;
}

export default function CountdownBadge({ dueDate, isCompleted }: CountdownBadgeProps) {
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<'future' | 'urgent' | 'overdue' | 'done'>('future');

  useEffect(() => {
    if (isCompleted) {
      setText('Đã hoàn thành');
      setStatus('done');
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(dueDate).getTime();
      const diffMs = target - now;

      if (diffMs <= 0) {
        const overdueDays = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        setText(`Quá hạn ${overdueDays} ngày`);
        setStatus('overdue');
      } else {
        const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor(
          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        if (remainingDays === 0) {
          setText(`Còn ${remainingHours} giờ`);
          setStatus('urgent');
        } else if (remainingDays <= 3) {
          setText(`Còn ${remainingDays} ngày (Gấp)`);
          setStatus('urgent');
        } else {
          setText(`Còn ${remainingDays} ngày`);
          setStatus('future');
        }
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // cập nhật mỗi phút
    return () => clearInterval(interval);
  }, [dueDate, isCompleted]);

  if (!text) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-400">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        Đang tính...
      </span>
    );
  }

  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {text}
      </span>
    );
  }

  if (status === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
        <AlertTriangle className="w-3.5 h-3.5" />
        {text}
      </span>
    );
  }

  if (status === 'urgent') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
        <Clock className="w-3.5 h-3.5" />
        {text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
      <Clock className="w-3.5 h-3.5" />
      {text}
    </span>
  );
}
