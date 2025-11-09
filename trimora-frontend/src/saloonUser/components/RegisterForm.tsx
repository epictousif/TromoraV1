import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import type { RegisterRequest } from '../types/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  aadharCard: z.string().regex(/^[0-9]{12}$/, 'Aadhar card must be 12 digits'),
  panNumber: z
    .string()
    .transform((s) => s.toUpperCase().trim())
    .refine((s) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(s), {
      message: 'Invalid PAN format (e.g., ABCDE1234F)'
    })
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    
    const result = await registerUser(data as RegisterRequest);
    
    if (result.success) {
      reset();
      // Navigation will be handled by the auth state change
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl border-0">
      <CardHeader className="space-y-2 pb-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Join Trimora
          </h1>
          <p className="text-sm text-gray-600">
            Create your salon owner account
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md text-sm"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md text-sm"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md text-sm"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 px-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3 text-gray-400" />
                    ) : (
                      <Eye className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber" className="text-sm text-gray-700 font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md text-sm"
                    {...register('phoneNumber')}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Verification Documents Section */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
              Verification Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="aadharCard" className="text-sm text-gray-700 font-medium">
                  Aadhar Card Number
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="aadharCard"
                    type="text"
                    placeholder="Enter 12-digit Aadhar number"
                    className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md text-sm"
                    {...register('aadharCard')}
                  />
                </div>
                {errors.aadharCard && (
                  <p className="text-xs text-red-500">{errors.aadharCard.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="panNumber" className="text-sm text-gray-700 font-medium">
                  PAN Number
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="panNumber"
                    type="text"
                    placeholder="Enter PAN number (e.g., ABCDE1234F)"
                    className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md text-sm uppercase"
                    maxLength={10}
                    autoCapitalize="characters"
                    {...register('panNumber')}
                  />
                </div>
                {errors.panNumber && (
                  <p className="text-xs text-red-500">{errors.panNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200 mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 px-6 pb-4">
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-red-600 hover:text-red-700"
            onClick={onSwitchToLogin}
          >
            Sign in here
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
