import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { proxy } from '../proxy';

describe('retire-at proxy', () => {
  it('continues valid preset requests', () => {
    const response = proxy(new NextRequest('https://investingfire.com/learn/retire-at/35'));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it.each(['42', '035', '35.0', '35e0', 'foo'])('rewrites invalid param %j to not found', (age) => {
    const response = proxy(new NextRequest(`https://investingfire.com/learn/retire-at/${age}`));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://investingfire.com/retire-at-not-found',
    );
  });

  it('ignores query strings when validating route params', () => {
    const validResponse = proxy(
      new NextRequest('https://investingfire.com/learn/retire-at/35?age=42&monthlySpend=4000'),
    );
    const invalidResponse = proxy(
      new NextRequest('https://investingfire.com/learn/retire-at/42?age=35&monthlySpend=4000'),
    );

    expect(validResponse.headers.get('x-middleware-next')).toBe('1');
    expect(invalidResponse.headers.get('x-middleware-rewrite')).toBe(
      'https://investingfire.com/retire-at-not-found',
    );
  });
});
