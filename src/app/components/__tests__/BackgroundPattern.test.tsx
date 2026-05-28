import { render, waitFor } from '@testing-library/react';
import {
  Compass,
  Egg,
  Flag,
  Goal,
  Luggage,
  MapPinned,
  MountainSnow,
  PlaneTakeoff,
  Sailboat,
  Sun,
  TentTree,
  TicketsPlane,
  TreePalm,
  WavesLadder,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import BackgroundPattern from '../BackgroundPattern';
import { backgroundIconComponents } from '../BackgroundPattern';

describe('BackgroundPattern', () => {
  it('includes freedom and vacation icons in the background pool', () => {
    expect(backgroundIconComponents).toEqual(
      expect.arrayContaining([
        TicketsPlane,
        TreePalm,
        Flag,
        Goal,
        Compass,
        Egg,
        PlaneTakeoff,
        Luggage,
        MapPinned,
        Sun,
        WavesLadder,
        Sailboat,
        MountainSnow,
        TentTree,
      ]),
    );
  });

  it('renders background icons with full primary color and varied low opacity', async () => {
    const { container } = render((<BackgroundPattern />) as unknown as ReactNode);

    await waitFor(() => {
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    const icons = Array.from(container.querySelectorAll('svg'));
    const opacities = icons.map((icon) => Number(icon.style.opacity));

    expect(icons[0]).toHaveClass('text-primary');
    expect(Math.min(...opacities)).toBeGreaterThanOrEqual(0.05);
    expect(Math.max(...opacities)).toBeLessThanOrEqual(0.15);
    expect(new Set(opacities).size).toBeGreaterThan(1);
  });
});
