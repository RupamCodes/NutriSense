import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import { GoogleAuthButton } from './SignupForm';
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
export default function LoginForm({ onSwitch }) {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-sm mx-auto mt-8 md:mt-0">
      <div className="mb-8 md:hidden">
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span> NutriSense
        </h1>
      </div>
      <div className="mb-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Welcome Back</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Sign in to continue your health journey.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-stack-md">
        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="login-email">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-xl">mail</span>
            </span>
            <input {...register('email')} className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" id="login-email" placeholder="jane@example.com" type="email" />
          </div>
          {errors.email && <p className="text-error text-label-md mt-1 ml-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="login-password">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-xl">lock</span>
            </span>
            <input {...register('password')} className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" id="login-password" placeholder="••••••••" type="password" />
          </div>
          {errors.password && <p className="text-error text-label-md mt-1 ml-1">{errors.password.message}</p>}
        </div>
        <div className="pt-stack-sm">
          <button disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-lg text-label-lg text-on-primary bg-primary hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50" type="submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      <div className="mt-stack-md relative flex items-center justify-center">
        <div className="border-t border-outline-variant w-full absolute"></div>
        <span className="bg-surface-container-lowest px-4 font-label-md text-label-md text-outline relative z-10">or continue with</span>
      </div>
      <div className="mt-stack-md">
        <GoogleAuthButton />
      </div>
    </div>
  );
}
