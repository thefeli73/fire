import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { WebVitals } from '../web-vitals';

const { plausibleMock, reportWebVitalsMock } = vi.hoisted(() => ({
  plausibleMock: vi.fn(),
  reportWebVitalsMock: vi.fn(),
}));

vi.mock('next-plausible', () => ({
  usePlausible: () => plausibleMock,
}));

vi.mock('next/web-vitals', () => ({
  useReportWebVitals: reportWebVitalsMock,
}));

describe('WebVitals', () => {
  beforeEach(() => {
    plausibleMock.mockReset();
    reportWebVitalsMock.mockReset();
    window.history.pushState({}, '', '/learn/safe-withdrawal-rate-4-percent-rule');
  });

  it('sends only the rated metric to Plausible', () => {
    render((<WebVitals />) as unknown as ReactNode);

    const callback = reportWebVitalsMock.mock.calls[0]?.[0];
    expect(callback).toBeTypeOf('function');

    callback({
      name: 'INP',
      rating: 'poor',
      value: 450,
      delta: 450,
      id: 'metric-1',
      entries: [],
      navigationType: 'navigate',
    });

    const eventProps = plausibleMock.mock.calls[0]?.[1]?.props;
    expect(eventProps).toEqual({
      INP: 'poor',
    });
  });
});
