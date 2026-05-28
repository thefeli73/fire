'use client';
import { useState, useEffect } from 'react';
import type React from 'react';
import {
  type LucideIcon,
  HandCoins,
  Bitcoin,
  Coins,
  DollarSign,
  Euro,
  IndianRupee,
  JapaneseYen,
  PiggyBank,
  PoundSterling,
  Wallet,
  Banknote,
  ChartCandlestick,
  CirclePercent,
  CreditCard,
  Gem,
  Receipt,
  ShoppingBasket,
  Rocket,
  RockingChair,
  Sparkles,
  ChartPie,
  ChartBar,
  BarChart3,
  ChartLine,
  TrendingDown,
  TrendingUp,
  Vault,
  Landmark,
  Briefcase,
  Handshake,
  Shield,
  Lock,
  CalendarRange,
  Hourglass,
  Sprout,
  Target,
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
} from 'lucide-react';

export const backgroundIconComponents: LucideIcon[] = [
  HandCoins,
  Bitcoin,
  Coins,
  DollarSign,
  Euro,
  IndianRupee,
  JapaneseYen,
  PiggyBank,
  PoundSterling,
  Wallet,
  Banknote,
  ChartCandlestick,
  CirclePercent,
  CreditCard,
  Gem,
  Receipt,
  ShoppingBasket,
  Rocket,
  RockingChair,
  Sparkles,
  ChartPie,
  ChartBar,
  BarChart3,
  ChartLine,
  TrendingDown,
  TrendingUp,
  Vault,
  Landmark,
  Briefcase,
  Handshake,
  Shield,
  Lock,
  CalendarRange,
  Hourglass,
  Sprout,
  Target,
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
];

export default function MultiIconPattern({ opacity = 0.15, minOpacity = 0.05, spacing = 160 }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth > width + spacing * 2) {
        setWidth(window.innerWidth);
      }
      if (window.innerHeight > height + spacing * 2) {
        setHeight(window.innerHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [height, width, spacing]);

  useEffect(() => {
    setColumns(Math.ceil(width / spacing) + 3);
  }, [width, spacing]);

  useEffect(() => {
    setRows(Math.ceil(height / spacing) + 3);
  }, [height, spacing]);

  const [icons, setIcons] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    if (rows === 0 || columns === 0) {
      setIcons([]);
      return;
    }

    const iconElements: React.ReactElement[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        // Pick a random icon component from the array
        const randomIndex = Math.floor(Math.random() * backgroundIconComponents.length);
        const IconComponent = backgroundIconComponents[randomIndex];

        // Slightly randomize size and position for more organic feel
        const size = 30 + Math.floor(Math.random() * 8);
        const xOffset = Math.floor(Math.random() * (spacing / 1.618));
        const yOffset = Math.floor(Math.random() * (spacing / 1.618));
        const rotation = Math.round((Math.random() - 0.5) * 30);
        const iconOpacity = minOpacity + Math.random() * (opacity - minOpacity);

        iconElements.push(
          <IconComponent
            key={`icon-${String(x)}-${String(y)}`}
            size={size}
            className="text-primary fixed"
            strokeWidth={2.5}
            style={{
              left: `${String(x * spacing + xOffset)}px`,
              top: `${String(y * spacing + yOffset)}px`,
              opacity: iconOpacity,
              transform: `rotate(${String(rotation)}deg)`,
            }}
          />,
        );
      }
    }
    setIcons(iconElements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, columns, spacing, opacity, minOpacity]);

  return <div className="absolute z-0 h-full w-full">{width > 0 && icons}</div>;
}
