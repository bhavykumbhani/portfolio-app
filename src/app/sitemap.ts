import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/data-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bhavy-kumbhani-portfolio.vercel.app';
  
  let projects: { slug: string }[] = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...projectEntries,
  ];
}
