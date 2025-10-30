'use client'

import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <Sidebar />
        <main style={{ 
          flex: 1,
          overflowY: 'auto',
          height: '100vh',
          width: '100%'
        }}
        >
          {children}
        </main>
      </div>
      <AIAssistant />
    </ProtectedRoute>
  );
}
