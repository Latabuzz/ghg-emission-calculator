'use client'

import CompostingModule from '@/components/CompostingModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function CompostingPage() {
  return (
    <ProtectedLayout>
      <CompostingModule />
    </ProtectedLayout>
  );
}

