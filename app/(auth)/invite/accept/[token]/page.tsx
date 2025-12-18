// app/invite/accept/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteInfo, setInviteInfo] = useState<{ email: string; organization: string } | null>(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });

  // Optional: fetch invite details (you could add a GET endpoint if you want to show org name)
  // For now we just proceed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post(`/auth/invites/accept/${token}/`, {
        email: inviteInfo?.email || '', // backend validates it matches the invite
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
      });

      // Backend returns access + refresh tokens
      const { access, refresh } = res.data;

      Cookies.set(ACCESS_TOKEN, access, { expires: 1, secure: process.env.NODE_ENV === 'production' });
      Cookies.set(REFRESH_TOKEN, refresh, { expires: 7, secure: process.env.NODE_ENV === 'production' });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join mReport</CardTitle>
          <CardDescription>
            You have been invited to join an organization. Create your account to accept.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                required
                value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Accept Invite & Join'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}