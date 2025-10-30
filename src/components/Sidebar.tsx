'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bus,
  Trash2,
  Sprout,
  FlaskRound,
  Factory,
  ArrowDownUp,
  Flame,
  Cigarette,
  GitCompare,
  Database,
  FileDown,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transportation', href: '/transportation', icon: Bus },
  { name: 'Landfill', href: '/landfill', icon: Trash2 },
  { name: 'Composting', href: '/composting', icon: Sprout },
  { name: 'Anaerobic Digestion', href: '/anaerobic-digestion', icon: FlaskRound },
  { name: 'MBT', href: '/mbt', icon: Factory },
  { name: 'Recycling', href: '/recycling', icon: ArrowDownUp },
  { name: 'Incineration', href: '/incineration', icon: Flame },
  { name: 'Open Burning', href: '/open-burning', icon: Cigarette },
  { name: 'Scenarios', href: '/scenarios', icon: GitCompare },
  { name: 'Factors', href: '/factors', icon: Database },
  { name: 'Reports', href: '/reports', icon: FileDown },
  { name: 'About', href: '/about', icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl shadow-lg"
        style={{ backgroundColor: 'var(--sidebar-primary)', color: 'var(--sidebar-primary-foreground)' }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-30 h-screen w-64 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          backgroundColor: 'var(--sidebar)',
          borderRight: '1px solid var(--sidebar-border)',
          height: '100vh',
          flexShrink: 0
        }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="p-6" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/karwanua-logo.png"
                  alt="KarWanua Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1
                  className="text-lg font-bold"
                  style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--sidebar-primary)' }}
                >
                  KarWanua
                </h1>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Waste Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    backgroundColor: isActive ? 'var(--sidebar-primary)' : 'transparent',
                    color: isActive ? 'var(--sidebar-primary-foreground)' : 'var(--sidebar-foreground)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                  className="font-medium"
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 space-y-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium" style={{ color: 'var(--sidebar-foreground)' }}>
                Theme
              </span>
              <ThemeToggle />
            </div>

            {/* Credits */}
            <div className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
              <p>Based on IPCC Guidelines</p>
              <p>IGES Calculator vIII</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50"
          style={{ zIndex: 20 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
