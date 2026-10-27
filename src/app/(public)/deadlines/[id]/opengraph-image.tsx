import { ImageResponse } from 'next/og';
import { getDeadlineById, getSubjectBySlug } from '@/lib/db';


export const alt = 'Class Deadline Hub - Chi tiết Deadline';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  const subject = deadline ? await getSubjectBySlug(deadline.subjectSlug) : null;

  const title = deadline?.title || 'Class Deadline Hub';
  const subjectName = subject ? `${subject.code} - ${subject.name}` : 'Môn học PTIT';
  const dueDate = deadline
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN')
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#020617',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.25) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
        }}
      >
        {/* Header Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              padding: '10px 24px',
              borderRadius: '16px',
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              fontSize: '22px',
              fontWeight: 700,
              border: '1px solid #334155',
            }}
          >
            {subjectName}
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              fontSize: '20px',
              fontWeight: 600,
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            Hạn chót: {dueDate}
          </div>
        </div>

        {/* Tiêu đề chính */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
              maxWidth: '1040px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#94a3b8',
              lineHeight: 1.4,
              maxWidth: '960px',
            }}
          >
            {deadline?.description?.slice(0, 140)}...
          </div>
        </div>

        {/* Footer Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #1e293b',
            paddingTop: '30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
              Class Deadline Hub
            </div>
          </div>

          <div style={{ fontSize: '20px', color: '#64748b', fontWeight: 500 }}>
            Học viện Công nghệ Bưu chính Viễn thông
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
