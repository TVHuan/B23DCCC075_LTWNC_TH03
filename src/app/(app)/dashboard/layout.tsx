import { auth } from '@/auth';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Suspense } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Nested Sidebar */}
        <Suspense fallback={<div className="w-64 h-72 bg-slate-900/50 rounded-3xl animate-pulse" />}>
          <DashboardSidebar userRole={session?.user?.role} />
        </Suspense>

        {/* Nội dung trang con */}
        <div className="flex-1 w-full min-w-0">{children}</div>
      </div>
    </div>
  );
}
