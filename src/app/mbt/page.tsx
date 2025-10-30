'use client'

import MBTModule from '@/components/MBTModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function MBTPage() {
  return (
    <ProtectedLayout>
      <MBTModule />
    </ProtectedLayout>
  );
}

