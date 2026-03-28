import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { login } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(email.trim(), password);
    setLoading(false);
    if (!ok) {
      setError("Invalid email or password.");
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-heading font-bold text-xl mb-6"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
              NexaAI
            </span>
          </Link>
          <h1 className="font-heading font-bold text-2xl text-[#F2F5FF] mb-2">
            Welcome back
          </h1>
          <p className="text-[#A8B0C4]">Sign in to your NexaAI account</p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#11182A]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-ocid="login.modal"
          >
            <div>
              <label
                className="block text-[#A8B0C4] text-sm mb-1.5"
                htmlFor="login-email"
              >
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus:border-[#8B5CF6]/50"
                data-ocid="login.input"
              />
            </div>
            <div>
              <label
                className="block text-[#A8B0C4] text-sm mb-1.5"
                htmlFor="login-password"
              >
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus:border-[#8B5CF6]/50"
                data-ocid="login.input"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm" data-ocid="login.error_state">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 h-11 mt-2"
              data-ocid="login.primary_button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-[#A8B0C4] text-sm mt-5">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#8B5CF6] hover:underline"
              data-ocid="login.link"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-[#A8B0C4] text-xs mt-6">
          <Link
            to="/"
            className="hover:text-[#F2F5FF] transition-colors"
            data-ocid="login.link"
          >
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
