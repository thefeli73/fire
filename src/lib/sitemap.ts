import { promises as fs } from 'fs';
import path from 'path';
import { type MetadataRoute } from 'next';

import { BASE_URL } from '@/lib/constants';

interface PageRoute {
  pathname: string;
  lastModified: Date;
}

const PAGE_FILE_PATTERN = /^page\.(mdx|tsx?|jsx?)$/;
const EXCLUDED_DIRECTORIES = new Set(['components', '__tests__', 'api']);
const APP_DIR = path.join(process.cwd(), 'src', 'app');

const isRouteGroup = (name: string) => name.startsWith('(') && name.endsWith(')');
const shouldSkipDirectory = (name: string) =>
  EXCLUDED_DIRECTORIES.has(name) || name.startsWith('_') || name.startsWith('.') || name.includes('[');

async function discoverPages(currentDir: string, segments: string[] = []): Promise<PageRoute[]> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const pages: PageRoute[] = [];

  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(entry.name)) {
        continue;
      }

      const nextSegments = isRouteGroup(entry.name) ? segments : [...segments, entry.name];
      const childPages = await discoverPages(entryPath, nextSegments);
      pages.push(...childPages);
      continue;
    }

    if (entry.isFile() && PAGE_FILE_PATTERN.test(entry.name)) {
      const pathname = segments.length === 0 ? '/' : `/${segments.join('/')}`;
      const stats = await fs.stat(entryPath);

      pages.push({ pathname, lastModified: stats.mtime });
    }
  }

  return pages;
}

function toAbsoluteUrl(pathname: string): string {
  const normalized = pathname === '/' ? '' : pathname;
  return new URL(normalized, BASE_URL).toString();
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const pages = await discoverPages(APP_DIR);

  const uniquePages = new Map<string, PageRoute>();
  for (const page of pages) {
    const existing = uniquePages.get(page.pathname);
    if (!existing || existing.lastModified < page.lastModified) {
      uniquePages.set(page.pathname, page);
    }
  }

  const sortedPages = Array.from(uniquePages.values()).sort((a, b) =>
    a.pathname.localeCompare(b.pathname),
  );

  return sortedPages.map(({ pathname, lastModified }) => ({
    url: toAbsoluteUrl(pathname),
    lastModified,
    changeFrequency: 'weekly',
    priority: pathname === '/' ? 1 : 0.8,
  }));
}
