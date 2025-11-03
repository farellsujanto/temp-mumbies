import { Flag, Award, Heart, Users, Leaf, Home } from 'lucide-react';

interface BadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

const badgeConfig: Record<string, { label: string; icon: any; color: string }> = {
  made_in_usa: { label: 'Made in USA', icon: Flag, color: 'bg-blue-100 text-blue-700' },
  b_corp: { label: 'B Corp', icon: Award, color: 'bg-purple-100 text-purple-700' },
  donates_to_rescues: { label: 'Supports Rescues', icon: Heart, color: 'bg-red-100 text-red-700' },
  family_owned: { label: 'Family-Owned', icon: Users, color: 'bg-amber-100 text-amber-700' },
  woman_owned: { label: 'Woman-Owned', icon: Users, color: 'bg-pink-100 text-pink-700' },
  veteran_owned: { label: 'Veteran-Owned', icon: Flag, color: 'bg-blue-100 text-blue-700' },
  small_business: { label: 'Small Business', icon: Home, color: 'bg-green-100 text-green-700' },
  organic: { label: 'Organic', icon: Leaf, color: 'bg-green-100 text-green-700' },
  sustainable: { label: 'Sustainable', icon: Leaf, color: 'bg-emerald-100 text-emerald-700' },
};

export default function Badge({ type, size = 'md' }: BadgeProps) {
  const config = badgeConfig[type];
  if (!config) return null;

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.label}
    </span>
  );
}
