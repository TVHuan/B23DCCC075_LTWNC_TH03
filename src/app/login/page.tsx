import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Đăng nhập | Class Deadline Hub',
  description: 'Đăng nhập cổng thông tin deadline lớp học PTIT',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
