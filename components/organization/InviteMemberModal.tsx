// components/organization/InviteMemberModal.tsx
'use client';

import { useState, useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InviteMemberModal({ open, onOpenChange, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/auth/invites/create/', { 
        email: email.trim(), 
        role: selectedRole 
      });

      setMessage('Invitation sent successfully!');
      setEmail('');
      setSelectedRole('viewer');

      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.email?.[0] || 'Failed to send invite';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing
      setEmail('');
      setSelectedRole('viewer');
      setMessage('');
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. They will receive an email with a link to create their account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole} disabled={loading}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="responder">Responder</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {message && (
            <p
              className={`text-sm font-medium text-center ${
                message.includes('success') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}