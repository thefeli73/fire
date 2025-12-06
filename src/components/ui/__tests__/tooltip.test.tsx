import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

const setupMatchMedia = (matches: boolean) => {
  const listeners = new Set<EventListenerOrEventListenerObject>();

  const mockMatchMedia = (query: string): MediaQueryList => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === 'change') {
        listeners.add(listener);
      }
    },
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === 'change') {
        listeners.delete(listener);
      }
    },
    addListener: () => {
      /* deprecated */
    },
    removeListener: () => {
      /* deprecated */
    },
    dispatchEvent: (event: Event) => {
      listeners.forEach((listener) => {
        if (typeof listener === 'function') {
          listener(event);
        } else {
          listener.handleEvent(event);
        }
      });
      return true;
    },
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(mockMatchMedia),
  });
};

describe('Tooltip hybrid behaviour', () => {
  beforeEach(() => {
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

    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: ResizeObserverMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to popover interaction on touch devices', async () => {
    setupMatchMedia(true);

    render(
      <Tooltip>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toHaveAttribute('data-touch', 'true');

    const user = userEvent.setup();
    await user.click(trigger);

    expect(
      await screen.findByText('Tooltip text', { selector: '[data-slot="tooltip-content"]' }),
    ).toBeVisible();
  });

  it('keeps tooltip interaction on non-touch devices', async () => {
    setupMatchMedia(false);

    render(
      <Tooltip defaultOpen>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toHaveAttribute('data-touch', 'false');

    expect(
      await screen.findByText('Tooltip text', { selector: '[data-slot="tooltip-content"]' }),
    ).toBeVisible();
  });
});
