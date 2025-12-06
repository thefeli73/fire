import { describe, expect, it } from 'vitest';

import { buildSitemapEntries } from '../sitemap';

describe('buildSitemapEntries', () => {
  it('includes known static routes', async () => {
    const sitemap = await buildSitemapEntries();
    const urls = sitemap.map((entry) => entry.url);

    expect(urls).toContain('https://investingfire.com/');
    expect(urls).toContain('https://investingfire.com/learn');
    expect(urls).toContain('https://investingfire.com/learn/what-is-fire');
    expect(sitemap.every((entry) => entry.lastModified instanceof Date)).toBe(true);
  });

  it('omits metadata routes from the sitemap output', async () => {
    const sitemap = await buildSitemapEntries();
    const urls = sitemap.map((entry) => entry.url);

    expect(urls.some((url) => url.includes('sitemap'))).toBe(false);
    expect(urls.some((url) => url.includes('robots'))).toBe(false);
  });
});
