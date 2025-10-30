'use client'

import ScenariosModule from '@/components/ScenariosModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function ScenariosPage() {
  return (
    <ProtectedLayout>
      <ScenariosModule />
    </ProtectedLayout>
  );
}

