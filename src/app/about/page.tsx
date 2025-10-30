'use client'

import AboutModule from '@/components/AboutModule';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function AboutPage() {
  return (
    <ProtectedLayout>
      <AboutModule />
    </ProtectedLayout>
  );
}

