import {
  Code2, BarChart3, TrendingUp, Users, Megaphone, Landmark,
  Cog, ClipboardList, Headphones, PenLine, Target, Keyboard,
  Pill, HeartPulse, BedDouble, Sprout, Scale, Calculator, HardHat,
  MonitorSmartphone, Briefcase, type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Code2,
  BarChart3,
  TrendingUp,
  Users,
  Megaphone,
  Landmark,
  Cog,
  ClipboardList,
  Headphones,
  PenLine,
  Target,
  Keyboard,
  Pill,
  HeartPulse,
  BedDouble,
  Sprout,
  Scale,
  Calculator,
  HardHat,
  MonitorSmartphone,
  Briefcase,
};

export function getRoleIcon(name: string): LucideIcon {
  return iconMap[name] ?? Briefcase;
}
