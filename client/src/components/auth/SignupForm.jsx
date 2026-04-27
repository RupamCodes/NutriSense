import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});
export default function SignupForm({ onSwitch }) {
  const { register: registerUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.email, data.password, data.fullName);
      toast.success('Account created!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Create Account</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Join NutriSense to start your health journey.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-stack-md">
        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="signup-name">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-xl">person</span>
            </span>
            <input {...register('fullName')} className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" id="signup-name" placeholder="Jane Doe" type="text" />
          </div>
          {errors.fullName && <p className="text-error text-label-md mt-1 ml-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="signup-email">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-xl">mail</span>
            </span>
            <input {...register('email')} className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" id="signup-email" placeholder="jane@example.com" type="email" />
          </div>
          {errors.email && <p className="text-error text-label-md mt-1 ml-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="signup-password">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-xl">lock</span>
            </span>
            <input {...register('password')} className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" id="signup-password" placeholder="••••••••" type="password" />
          </div>
          <p className="font-label-md text-label-md text-outline mt-1 ml-1">Must be at least 8 characters.</p>
          {errors.password && <p className="text-error text-label-md mt-1 ml-1">{errors.password.message}</p>}
        </div>
        <div className="pt-stack-sm">
          <button disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-lg text-label-lg text-on-primary bg-primary hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50" type="submit">
            {loading ? 'Creating...' : 'Create Account'}
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
      <p className="mt-8 text-center font-label-md text-label-md text-outline">
        By signing up, you agree to our <a className="underline hover:text-primary" href="#">Terms</a> and <a className="underline hover:text-primary" href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
function GoogleAuthButton() {
  return (
    <button className="w-full flex justify-center items-center py-3 px-4 border border-outline-variant rounded-lg shadow-sm font-label-lg text-label-lg text-on-surface bg-surface-container-lowest hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" type="button">
      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Google
    </button>
  );
}
export { GoogleAuthButton };
