'use client'

import LandfillModule from '@/components/LandfillModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function LandfillPage() {
  return (
    <ProtectedLayout>
      <LandfillModule />
    </ProtectedLayout>
  );
}

