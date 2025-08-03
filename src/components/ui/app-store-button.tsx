"use client";

import React from 'react';
import { AppleIcon, GooglePlayIcon } from './app-store-icons';
import type { AppStoreButton } from '@/lib/types';

interface AppStoreButtonProps {
  button: AppStoreButton;
  className?: string;
}

export function AppStoreButton({ button, className }: AppStoreButtonProps) {
  const Icon = button.icon === 'apple' ? AppleIcon : GooglePlayIcon;
  
  return (
    <a
      href={button.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-98 shadow-lg min-h-[56px] touch-manipulation focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${className || ''}`}
      style={{ 
        backgroundColor: '#000000',
        color: '#FFFFFF',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1a1a1a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#000000';
      }}
      aria-label={`${button.text} - Download Spilled app`}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <div className="flex flex-col items-start text-left">
        <span className="text-xs opacity-90">
          {button.icon === 'apple' ? 'Download on the' : 'Get it on'}
        </span>
        <span className="text-lg font-bold leading-tight">
          {button.icon === 'apple' ? 'App Store' : 'Google Play'}
        </span>
      </div>
    </a>
  );
}