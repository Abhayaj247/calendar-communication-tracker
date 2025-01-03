import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from './types';

interface NavigationLinkProps {
  item: NavigationItem;
  isActive: boolean;
}

export default function NavigationLink({ item, isActive }: NavigationLinkProps) {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out ${
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`mr-2 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
      {item.name}
    </Link>
  );
}