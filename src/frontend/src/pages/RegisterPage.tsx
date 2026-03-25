import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Fingerprint,
  Globe,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function RegisterPage() {
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
            Create your account
          </h1>
          <p className="text-[#A8B0C4]">Start building with AI in minutes</p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#11182A]">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: <Shield className="w-4 h-4" />, label: "Secure" },
              { icon: <Fingerprint className="w-4 h-4" />, label: "Private" },
              { icon: <Globe className="w-4 h-4" />, label: "Decentralized" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20"
              >
                <span className="text-[#8B5CF6]">{item.icon}</span>
                <span className="text-[#A8B0C4] text-xs">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-[#A8B0C4] text-sm text-center mb-6">
            NexaAI uses{" "}
            <strong className="text-[#F2F5FF]">Internet Identity</strong> — no
            passwords, no data collected.
          </p>

          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 h-11"
            data-ocid="register.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Creating
                Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-center text-[#A8B0C4] text-sm mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8B5CF6] hover:underline"
              data-ocid="register.link"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-[#A8B0C4] text-xs mt-6">
          <Link
            to="/"
            className="hover:text-[#F2F5FF] transition-colors"
            data-ocid="register.link"
          >
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
