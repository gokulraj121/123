import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/auth';

export default function Auth({ children }: { children: React.ReactNode }) {
  // Temporarily disable auth checks
  return children;
}
