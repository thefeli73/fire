import { describe, expect, it } from 'vitest';

import { RETIRE_AT_AGE_PRESETS } from '@/lib/retire-at';
import { generateStaticParams } from '../[age]/page';

describe('retire-at generateStaticParams', () => {
  it('returns all preset ages as strings with no duplicates', () => {
    const params = generateStaticParams();
    const ages = params.map((p) => p.age);

    expect(ages).toHaveLength(RETIRE_AT_AGE_PRESETS.length);
    expect(new Set(ages).size).toBe(ages.length);
    expect(ages).toEqual(RETIRE_AT_AGE_PRESETS.map((age) => age.toString()));
  });
});

