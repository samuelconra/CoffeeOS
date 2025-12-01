import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

function LoginPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        toast.promise(
            login(email, password),
            {
                loading: 'Signing in...',
                success: () => {
                    navigate('/');
                    return 'Welcome Back!';
                },
                error: (err) =>{
                    console.log(err);
                    return err.message || 'Error signing in.'
                } 
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4">
            <Coffee className="size-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Welcome to CoffeeOS</h1>
          <p className="text-gray-600">Sign in to discover amazing coffee shops</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                        />
                    </div>
                    </div>

                    {/* Password Input */}
                    <div>
                    <label htmlFor="password" className="block text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                        {showPassword ? (
                            <EyeOff className="size-5" />
                        ) : (
                            <Eye className="size-5" />
                        )}
                        </button>
                    </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="checkbox"
                        className="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/10"
                        />
                        <span className="text-gray-700">Remember me</span>
                    </label>
                    <button
                        type="button"
                        className="text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        Forgot password?
                    </button>
                    </div>

                    {/* Submit Button */}
                    <button
                    type="submit"
                    className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200/60"></div>
                    </div>
                    <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200/60 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    <svg className="size-5" viewBox="0 0 24 24">
                        <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span className="text-gray-700">Google</span>
                    </button>
                    <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200/60 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span className="text-gray-700">GitHub</span>
                    </button>
                </div>
                </div>

                {/* Sign Up Link */}
                <p className="text-center mt-6 text-gray-600">
                Don't have an account?{' '}
                <button className="text-gray-900 hover:underline">
                    Sign up
                </button>
                </p>
            </div>
        </div>
    )


}

export default LoginPage;