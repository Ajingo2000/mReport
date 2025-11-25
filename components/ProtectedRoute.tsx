'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN } from '@/constants';
import { AuthService } from '@/lib/services';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      const token = Cookies.get(ACCESS_TOKEN);
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user profile to verify token validity
        const user = await AuthService.getUserProfile();
        if (user) {
          setAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verifying access...</p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
