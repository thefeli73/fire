"use client";
import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function MultiIconPattern({ opacity = 0.2, spacing = 160 }) {
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
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [height, width, spacing]);

  useEffect(() => {
    setColumns(Math.ceil(width / spacing) + 3);
  }, [width, spacing]);

  useEffect(() => {
    setRows(Math.ceil(height / spacing) + 3);
  }, [height, spacing]);

  // Explicitly type the array as LucideIcon[]
  const iconComponents: LucideIcon[] = [
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
  ];

  const renderIcons = ({
    rows,
    columns,
  }: {
    rows: number;
    columns: number;
  }) => {
    const icons = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        // Pick a random icon component from the array
        const randomIndex = Math.floor(Math.random() * iconComponents.length);
        const IconComponent = iconComponents[randomIndex];

        // Slightly randomize size and position for more organic feel
        const size = 28 + Math.floor(Math.random() * 8);
        const xOffset = Math.floor(Math.random() * (spacing / 1.618));
        const yOffset = Math.floor(Math.random() * (spacing / 1.618));

        icons.push(
          <IconComponent
            key={`icon-${x}-${y}`}
            size={size}
            className="text-primary fixed"
            style={{
              left: `${x * spacing + xOffset}px`,
              top: `${y * spacing + yOffset}px`,
              opacity: opacity,
              transform: `rotate(${Math.round((Math.random() - 0.5) * 30)}deg)`,
            }}
          />,
        );
      }
    }
    return icons;
  };

  return (
    <div className="absolute h-full w-full">
      {width > 0 && renderIcons({ rows, columns })}
    </div>
  );
}
