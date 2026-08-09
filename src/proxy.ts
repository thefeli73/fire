import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isRetireAtAgeParam } from '@/lib/retire-at';

export const config = {
  matcher: '/learn/retire-at/:age',
};

export function proxy(request: NextRequest) {
  const age = request.nextUrl.pathname.split('/').at(-1) ?? '';

  return isRetireAtAgeParam(age)
    ? NextResponse.next()
    : NextResponse.rewrite(new URL('/retire-at-not-found', request.url));
}
