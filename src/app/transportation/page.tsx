'use client'

import TransportationModule from '@/components/TransportationModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function TransportationPage() {
  return (
    <ProtectedLayout>
      <TransportationModule />
    </ProtectedLayout>
  );
}

