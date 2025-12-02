import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Coffee, Mail, Lock, Eye, EyeOff, User, AtSign } from "lucide-react";

function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    toast.promise(signup(username, fullName, email, password), {
      loading: "Creating account...",
      success: () => {
        navigate("/");
        return "Account created successfully!";
      },
      error: (err) => {
        return err.message || "Error creating account.";
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
          <h1 className="text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600">Join CoffeeOS to discover amazing places</p>
        </div>

        {/* SignUp Card */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-sm">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullname" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign up
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
