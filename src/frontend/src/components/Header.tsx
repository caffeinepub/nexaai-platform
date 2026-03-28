import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Moon, Sun, UserCircle, X, Zap } from "lucide-react";
import { useState } from "react";
import { getCurrentUser, logout } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const currentUser = getCurrentUser();
  const isAuthenticated = !!currentUser;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: "Tools", to: "/tools" },
    { label: "Contact", to: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{
        background:
          theme === "light" ? "rgba(248,249,255,0.92)" : "rgba(7,10,18,0.92)",
        backdropFilter: "blur(12px)",
      }}
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
            <>
              <Link
                to="/dashboard"
                className="text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors text-sm font-medium"
                data-ocid="header.link"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors text-sm font-medium"
                data-ocid="header.link"
              >
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#A8B0C4] hover:text-[#F2F5FF] hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
            data-ocid="header.toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-[#F2F5FF] hover:bg-white/10"
                  data-ocid="header.secondary_button"
                >
                  <UserCircle className="w-4 h-4 mr-1" />
                  {currentUser?.name || "Profile"}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-[#F2F5FF] hover:bg-white/10"
                onClick={handleLogout}
                data-ocid="header.secondary_button"
              >
                Log Out
              </Button>
            </>
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

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors"
            aria-label="Toggle theme"
            data-ocid="header.toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            className="text-[#F2F5FF]"
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
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-3"
          style={{
            background: theme === "light" ? "#F8F9FF" : "#070A12",
          }}
        >
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
              <Link
                to="/profile"
                className="text-[#A8B0C4] hover:text-[#F2F5FF] py-2 text-sm"
                onClick={() => setMobileOpen(false)}
                data-ocid="header.link"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
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
