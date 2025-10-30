'use client'

import OpenBurningModule from '@/components/OpenBurningModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function OpenBurningPage() {
  return (
    <ProtectedLayout>
      <OpenBurningModule />
    </ProtectedLayout>
  );
}

