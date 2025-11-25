'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthService } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { FiCheck } from 'react-icons/fi';
import Image from 'next/image';
import registerIllustration from '@/public/images/registerIllustration.png';
import myLogo from "@/public/images/favicon.png";

const RegisterPage: React.FC = () => {
  // ------------------- Functional Logic (Unchanged) -------------------
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  interface Errors {
    email?: string;
    password?: string;
    password2?: string;
    first_name?: string;
    last_name?: string;
    general?: string;
  }

  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [returnEmail, setReturnEmail] = useState('');

  // 🔒 Show/hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name as keyof Errors]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password2)
      newErrors.password2 = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await AuthService.register(formData);
      if (res) {
        setReturnEmail(res.email);
        setSuccess(true);
        setFormData({
          email: '',
          password: '',
          password2: '',
          first_name: '',
          last_name: '',
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Register - mReport | Join the Humanitarian Response Network';
  }, []);

  // ------------------- Success Message -------------------
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-indigo-50 via-sky-100 to-blue-200 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiCheck className="text-green-500 text-4xl font-black" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Registration Successful</h2>
          <p className="text-gray-600 mt-2 mb-5">
            Please check your email for verification instructions.
          </p>
          <span className="text-neutral-800 font-semibold text-sm">
            If you don’t see the email, please check your spam folder.
          </span>
        </div>
      </div>
    );
  }

  // ------------------- Styled UI (Theme Matched with Login) -------------------
  return (
    <div className="min-h-screen flex">
      {/* Left Side: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <Image
                src={myLogo}
                alt="Mreport Logo"
                className="w-20 h-20 lg:w-32 lg:h-32"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground">
              Join mReport to begin contributing to the humanitarian response network.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium text-foreground">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    className="pl-9 h-12"
                    required
                  />
                </div>
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name}</p>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium text-foreground">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="pl-9 h-12"
                    required
                  />
                </div>
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="pl-9 h-12"
                  required
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="pl-9 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="password2" className="text-sm font-medium text-foreground">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Input
                  id="password2"
                  name="password2"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="pl-9 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password2 && <p className="text-sm text-destructive">{errors.password2}</p>}
            </div>

            {errors.general && (
              <p className="text-sm text-destructive text-center">{errors.general}</p>
            )}

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Redirect */}
          <p className="text-center text-sm text-muted-foreground">
            Go to{' '}
            <Link href="/login" className="text-orange-300 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
