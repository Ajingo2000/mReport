'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthService } from '@/lib/services';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, User, Users, Eye, EyeOff } from 'lucide-react';
import { FiCheck } from 'react-icons/fi';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  // ------------------- Form State -------------------
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    organization_name: '',
  });

  // ------------------- Errors & UI State -------------------
  interface Errors {
    email?: string;
    password?: string;
    password2?: string;
    first_name?: string;
    last_name?: string;
    organization_name?: string;
    general?: string;
  }

  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [returnEmail, setReturnEmail] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ------------------- Handlers -------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name as keyof Errors]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.organization_name.trim()) newErrors.organization_name = 'Organization name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password2) newErrors.password2 = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await AuthService.register(formData);
      if (res && res.email) {
        setReturnEmail(res.email);
        setSuccess(true);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.error || error.message || 'Registration failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Register - mReport | Join the Humanitarian Response Network';
  }, []);

  // ------------------- Success Screen -------------------
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-orange-200 via-orange-300 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <FiCheck className="text-green-600 text-5xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">You're Almost There!</h2>
          <p className="text-gray-700 text-lg mb-3">
            A verification email has been sent to:
          </p>
          <p className="text-xl font-semibold text-blue-600 mb-6">{returnEmail}</p>
          <p className="text-gray-600">
            Please check your inbox (and spam folder) and click the link to activate your account.
          </p>
          <p className="text-sm text-gray-500 mt-6">
            You’ll be automatically logged in after verification.
          </p>
        </div>
      </div>
    );
  }

  // ------------------- Registration Form -------------------
  return (
    <div className="min-h-screen flex ">
      {/* Left Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className='p'>←</Link>
              <Image
                src="/images/favicon.png"
                alt="mReport Logo"
                width={128}
                height={128}
                className="w-32 h-32"
              />
            

          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground">
              Join mReport to contribute to humanitarian response
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    className="pl-10 h-12"
                    required
                  />
                </div>
                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="pl-10 h-12"
                    required
                  />
                </div>
                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.org"
                  className="pl-10 h-12"
                  required
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Organization */}
            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization Name <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Users className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="organization_name"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  placeholder="e.g. UNICEF Uganda, Red Cross"
                  className="pl-10 h-12"
                  required
                />
              </div>
              {errors.organization_name && (
                <p className="text-sm text-destructive">{errors.organization_name}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="pl-10 pr-12 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="password2">Confirm Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password2"
                  name="password2"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="pl-10 pr-12 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
              {errors.password2 && <p className="text-sm text-destructive">{errors.password2}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <p className="text-sm text-destructive text-center font-medium">{errors.general}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 text-white bg-orange-600 font-semibold rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-orange-600 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;