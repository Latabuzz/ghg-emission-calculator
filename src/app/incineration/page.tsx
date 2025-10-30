'use client'

import IncinerationModule from '@/components/IncinerationModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function IncinerationPage() {
  return (
    <ProtectedLayout>
      <IncinerationModule />
    </ProtectedLayout>
  );
}

