
'use client';
import { useRouter } from 'next/navigation';

export default function OldLayoutPage() {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    router.replace('/settings/layouts');
  }
  return null;
}
