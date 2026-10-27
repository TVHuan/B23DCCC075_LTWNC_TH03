import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Class Deadline Hub - Cổng thông tin & Quản lý Deadline Lớp',
    template: '%s | Class Deadline Hub',
  },
  description:
    'Cổng thông tin deadline chính thức của lớp học PTIT. Theo dõi tiến độ bài tập, đồ án, nộp báo cáo và quản lý lịch học tập hiệu quả.',
  keywords: ['Deadline', 'PTIT', 'Class Deadline Hub', 'Next.js App Router', 'Học viện Công nghệ Bưu chính Viễn thông'],
  authors: [{ name: 'B23DCCC075' }],
  openGraph: {
    title: 'Class Deadline Hub - Cổng Deadline Lớp PTIT',
    description: 'Theo dõi tiến độ bài tập, đồ án và lịch trình nộp báo cáo môn học.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Class Deadline Hub',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
