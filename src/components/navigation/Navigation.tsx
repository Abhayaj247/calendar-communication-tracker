import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Building2, LayoutDashboard, Calendar } from 'lucide-react';
import { NavigationItem } from './types';
import NavigationLink from './NavigationLink';

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

interface NavigationProps {
  currentPath: string;
}

export default function Navigation({ currentPath }: NavigationProps) {
  return (
    <div className="hidden sm:flex sm:space-x-6">
      {navigationItems.map((item) => (
        <NavigationLink
          key={item.name}
          item={item}
          isActive={currentPath === item.href}
        />
      ))}
    </div>
  );
}