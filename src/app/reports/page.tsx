'use client'

import ReportsModule from '@/components/ReportsModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function ReportsPage() {
  return (
    <ProtectedLayout>
      <ReportsModule />
    </ProtectedLayout>
  );
}

