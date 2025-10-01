'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Validation schemas
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, { message: 'Email or username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const response = await result.json();

      if (response.success) {
        setSuccess('You have successfully logged in!');
        login(response.user);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(response.error || 'An error occurred while logging in');
      }
    } catch (error) {
      setError('An error occurred while logging in. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const response = await result.json();

      if (response.success) {
        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);
      } else {
        setError(response.error || 'An error occurred during registration');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#CCCCCC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Register for a new account'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 animate-fade-in">
            <div className="flex items-center">
              ✅ {success}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 animate-fade-in">
            <div className="flex items-center">
              ❌ {error}
            </div>
          </div>
        )}

        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} onSubmit={handleLogin} isLoading={isLoading} />
        ) : (
          <RegistrationForm onToggleForm={toggleForm} onSubmit={handleRegister} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

// Login Form
function LoginForm({ onToggleForm, onSubmit, isLoading }: {
  onToggleForm: () => void;
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl animate-fade-in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              type="text"
              placeholder="Enter your email or username"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${
                errors.emailOrUsername ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('emailOrUsername')}
            />
            {errors.emailOrUsername && <p className="mt-1 text-sm text-red-600">{errors.emailOrUsername.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
            <span className="ml-2 text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Don’t have an account?{' '}
            <button type="button" onClick={onToggleForm} className="text-blue-600 hover:text-blue-500 font-medium">
              Register
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

// Registration Form
function RegistrationForm({ onToggleForm, onSubmit, isLoading }: {
  onToggleForm: () => void;
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const watchPassword = watch('password', '');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl animate-fade-in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
        </div>

        {/* Password Strength */}
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Password must be at least 6 characters.</div>
          {watchPassword && (
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition ${
                    watchPassword.length >= level * 1.5
                      ? watchPassword.length >= 6
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button type="button" onClick={onToggleForm} className="text-blue-600 hover:text-blue-500 font-medium">
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}