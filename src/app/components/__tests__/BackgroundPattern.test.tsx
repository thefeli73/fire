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
import { describe, expect, it } from 'vitest';

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
});
