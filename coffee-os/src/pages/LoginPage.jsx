import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Coffee, Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    toast.promise(login(email, password), {
      loading: "Signing in...",
      success: () => {
        navigate("/");
        return "Welcome Back!";
      },
      error: (err) => {
        return err.message || "Error signing in.";
      },
    });
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
                  placeholder="user@gmail.com"
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
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
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
              <button type="button" className="text-gray-700 hover:text-gray-900 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          {"Don't have an account?"}{" "}
          <Link to="/signup" className="text-gray-900 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
