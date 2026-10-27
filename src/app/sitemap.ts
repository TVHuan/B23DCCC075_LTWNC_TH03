import { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  // Các trang tĩnh
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Các trang môn học (SSG)
  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((sub) => ({
    url: `${baseUrl}/subjects/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Toàn bộ các trang chi tiết Deadline (ISR)
  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((dl) => ({
    url: `${baseUrl}/deadlines/${dl.id}`,
    lastModified: new Date(dl.createdAt || new Date()),
    changeFrequency: 'hourly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
