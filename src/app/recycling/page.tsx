'use client'

import RecyclingModule from '@/components/RecyclingModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function RecyclingPage() {
  return (
    <ProtectedLayout>
      <RecyclingModule />
    </ProtectedLayout>
  );
}

