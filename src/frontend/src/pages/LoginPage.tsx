import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) navigate({ to: "/dashboard" });
  }, [identity, navigate]);

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
          <div className="mb-6 p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
            <p className="text-[#A8B0C4] text-sm text-center">
              NexaAI uses{" "}
              <strong className="text-[#F2F5FF]">Internet Identity</strong> for
              secure, password-free authentication.
            </p>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 h-11"
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Connecting...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-center text-[#A8B0C4] text-sm mt-5">
            Don't have an account?{" "}
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
