import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Home } from "lucide-react";
import { motion } from "motion/react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#22D3EE]/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-[#8B5CF6]" />
        </div>
        <h1 className="font-heading font-extrabold text-7xl text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text mb-3">
          404
        </h1>
        <h2 className="font-heading font-bold text-2xl text-[#F2F5FF] mb-3">
          Page not found
        </h2>
        <p className="text-[#A8B0C4] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button
            className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
            data-ocid="notfound.primary_button"
          >
            <Home className="mr-2 w-4 h-4" /> Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
