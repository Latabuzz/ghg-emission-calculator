'use client'

import FactorsModule from '@/components/FactorsModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function FactorsPage() {
  return (
    <ProtectedLayout>
      <FactorsModule />
    </ProtectedLayout>
  );
}

