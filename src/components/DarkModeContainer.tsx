'use client';

import React from 'react';

interface DarkModeContainerProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Container component yang otomatis support dark mode
 * Menggunakan CSS variables untuk automatic theme switching
 */
export function DarkModeCard({ className = '', children, style }: DarkModeContainerProps) {
  return (
    <div
      className={`dark-mode-card ${className}`}
      style={{
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function DarkModeSection({ className = '', children, style }: DarkModeContainerProps) {
  return (
    <section
      className={`dark-mode-section ${className}`}
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        ...style
      }}
    >
      {children}
    </section>
  );
}

export function DarkModeHeader({ className = '', children, style }: DarkModeContainerProps) {
  return (
    <div
      className={`dark-mode-header ${className}`}
      style={{
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        color: 'var(--foreground)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * Wrapper untuk text yang auto-adapt ke dark mode
 */
export function AdaptiveText({
  className = '',
  children,
  style,
  variant = 'default',
}: DarkModeContainerProps & { variant?: 'default' | 'muted' | 'primary' }) {
  const colorMap = {
    default: 'var(--foreground)',
    muted: 'var(--muted-foreground)',
    primary: 'var(--primary)',
  };

  return (
    <span
      className={className}
      style={{
        color: colorMap[variant],
        ...style
      }}
    >
      {children}
    </span>
  );
}

/**
 * Button dengan adaptive dark mode
 */
interface AdaptiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function AdaptiveButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  style,
  ...props
}: AdaptiveButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
    },
    secondary: {
      backgroundColor: 'var(--secondary)',
      color: 'var(--secondary-foreground)',
    },
    muted: {
      backgroundColor: 'var(--muted)',
      color: 'var(--muted-foreground)',
    },
  };

  return (
    <button
      className={`${sizeClasses[size]} rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95 ${className}`}
      style={{
        ...variantStyles[variant],
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Input field dengan adaptive dark mode
 */
interface AdaptiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function AdaptiveInput({ className = '', style, ...props }: AdaptiveInputProps) {
  return (
    <input
      className={`rounded-lg px-4 py-2 border transition-all duration-200 ${className}`}
      style={{
        backgroundColor: 'var(--input)',
        color: 'var(--foreground)',
        borderColor: 'var(--border)',
        ...style
      }}
      {...props}
    />
  );
}

/**
 * Select field dengan adaptive dark mode
 */
interface AdaptiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function AdaptiveSelect({ className = '', style, children, ...props }: AdaptiveSelectProps) {
  return (
    <select
      className={`rounded-lg px-4 py-2 border transition-all duration-200 ${className}`}
      style={{
        backgroundColor: 'var(--input)',
        color: 'var(--foreground)',
        borderColor: 'var(--border)',
        ...style
      }}
      {...props}
    >
      {children}
    </select>
  );
}

/**
 * Label yang adaptive
 */
interface AdaptiveLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function AdaptiveLabel({ className = '', style, children, ...props }: AdaptiveLabelProps) {
  return (
    <label
      className={`text-sm font-medium ${className}`}
      style={{
        color: 'var(--foreground)',
        ...style
      }}
      {...props}
    >
      {children}
    </label>
  );
}

/**
 * Info box dengan adaptive dark mode
 */
interface AdaptiveInfoBoxProps extends DarkModeContainerProps {
  type?: 'info' | 'warning' | 'success' | 'error';
}

export function AdaptiveInfoBox({
  type = 'info',
  className = '',
  children,
  style
}: AdaptiveInfoBoxProps) {
  const typeColors = {
    info: { bg: 'var(--muted)', text: 'var(--muted-foreground)' },
    warning: { bg: '#fef3c7', text: '#92400e' },
    success: { bg: '#d1fae5', text: '#065f46' },
    error: { bg: '#fee2e2', text: '#7f1d1d' },
  };

  return (
    <div
      className={`rounded-lg p-4 ${className}`}
      style={{
        backgroundColor: typeColors[type].bg,
        color: typeColors[type].text,
        ...style
      }}
    >
      {children}
    </div>
  );
}
