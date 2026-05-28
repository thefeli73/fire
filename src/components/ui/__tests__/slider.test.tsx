import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';

import { Slider } from '../slider';

beforeAll(() => {
  class ResizeObserverMock {
    observe() {
      /* noop */
    }
    unobserve() {
      /* noop */
    }
    disconnect() {
      /* noop */
    }
  }

  global.ResizeObserver = ResizeObserverMock;
});

describe('Slider', () => {
  it('keeps thumb mounted when controlled value changes', () => {
    const { container, rerender } = render(
      (<Slider value={[25]} min={0} max={100} />) as unknown as ReactNode,
    );
    const initialThumb = container.querySelector('[data-slot="slider-thumb"]');

    rerender((<Slider value={[26]} min={0} max={100} />) as unknown as ReactNode);

    expect(container.querySelector('[data-slot="slider-thumb"]')).toBe(initialThumb);
  });
});
