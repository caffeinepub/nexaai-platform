import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: "Tools", to: "/tools" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{ background: "rgba(7,10,18,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-heading font-bold text-xl"
          data-ocid="header.link"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
            NexaAI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors text-sm font-medium"
              data-ocid="header.link"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors text-sm font-medium"
              data-ocid="header.link"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-[#F2F5FF] hover:bg-white/10"
              onClick={clear}
              data-ocid="header.secondary_button"
            >
              Log Out
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-[#F2F5FF] hover:bg-white/10"
                  data-ocid="header.secondary_button"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
                  data-ocid="header.primary_button"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-[#F2F5FF]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="header.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070A12] px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[#A8B0C4] hover:text-[#F2F5FF] py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
              data-ocid="header.link"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-[#A8B0C4] hover:text-[#F2F5FF] py-2 text-sm"
                onClick={() => setMobileOpen(false)}
                data-ocid="header.link"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-left text-[#A8B0C4] hover:text-[#F2F5FF] py-2 text-sm"
                data-ocid="header.secondary_button"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 text-[#F2F5FF]"
                  data-ocid="header.secondary_button"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0"
                  data-ocid="header.primary_button"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
