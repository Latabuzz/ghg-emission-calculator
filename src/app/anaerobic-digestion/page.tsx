'use client'

import AnaerobicDigestionModule from '@/components/AnaerobicDigestionModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function AnaerobicDigestionPage() {
  return (
    <ProtectedLayout>
      <AnaerobicDigestionModule />
    </ProtectedLayout>
  );
}

