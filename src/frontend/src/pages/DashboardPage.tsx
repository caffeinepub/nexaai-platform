import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BookMarked,
  BookOpen,
  Clock,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const STATS = [
  {
    label: "Tools Used",
    value: "12",
    icon: <Wrench className="w-5 h-5" />,
    color: "from-[#8B5CF6] to-[#5B5CF6]",
  },
  {
    label: "Posts Read",
    value: "47",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-[#5B5CF6] to-[#22D3EE]",
  },
  {
    label: "Days Active",
    value: "30",
    icon: <Clock className="w-5 h-5" />,
    color: "from-[#22D3EE] to-[#8B5CF6]",
  },
  {
    label: "Saved Items",
    value: "8",
    icon: <BookMarked className="w-5 h-5" />,
    color: "from-[#8B5CF6] to-[#22D3EE]",
  },
];

const RECENT_ACTIVITY = [
  {
    action: "Summarized an article",
    tool: "Text Summarizer",
    time: "2 hours ago",
  },
  {
    action: "Generated a blog post",
    tool: "Content Generator",
    time: "Yesterday",
  },
  { action: "AI chat session", tool: "AI Chat", time: "2 days ago" },
  { action: "Read blog post", tool: "Blog", time: "3 days ago" },
];

export default function DashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 10)}...${principal.slice(-6)}`
    : "";

  const handleLogout = () => {
    clear();
    navigate({ to: "/" });
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "Overview",
      href: "/dashboard",
      active: true,
    },
    {
      icon: <Wrench className="w-4 h-4" />,
      label: "AI Tools",
      href: "/tools",
      active: false,
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Blog",
      href: "/blog",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A12] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/10 bg-[#0B1020] fixed h-full z-10">
        <div className="p-5 border-b border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading font-bold text-lg"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
              NexaAI
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/20"
                  : "text-[#A8B0C4] hover:bg-white/5 hover:text-[#F2F5FF]"
              }`}
              data-ocid="dashboard.link"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-3 px-3 py-2 rounded-lg bg-white/5">
            <p className="text-[#A8B0C4] text-xs truncate">Logged in as</p>
            <p className="text-[#F2F5FF] text-xs font-mono truncate">
              {shortPrincipal || "Anonymous"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-[#A8B0C4] hover:bg-red-500/10 hover:text-red-400 transition-colors"
            data-ocid="dashboard.secondary_button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-60 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F5FF] mb-1">
              Welcome back 👋
            </h1>
            <p className="text-[#A8B0C4] text-sm font-mono">{shortPrincipal}</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-xl border border-white/10 bg-[#11182A]"
                data-ocid="dashboard.card"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}
                >
                  {stat.icon}
                </div>
                <p className="font-heading font-bold text-2xl text-[#F2F5FF]">
                  {stat.value}
                </p>
                <p className="text-[#A8B0C4] text-xs mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-white/10 bg-[#11182A] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="font-heading font-semibold text-[#F2F5FF]">
                Recent Activity
              </h2>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((item, i) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  data-ocid={`dashboard.item.${i + 1}`}
                >
                  <div>
                    <p className="text-[#F2F5FF] text-sm">{item.action}</p>
                    <p className="text-[#A8B0C4] text-xs mt-0.5">{item.tool}</p>
                  </div>
                  <span className="text-[#A8B0C4] text-xs">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Link
              to="/tools"
              className="flex items-center gap-3 p-5 rounded-xl border border-white/10 bg-[#11182A] hover:border-[#8B5CF6]/40 transition-colors group"
              data-ocid="dashboard.link"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#5B5CF6] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[#F2F5FF] font-medium text-sm">
                  Open AI Tools
                </p>
                <p className="text-[#A8B0C4] text-xs">
                  Summarize, chat, generate
                </p>
              </div>
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-3 p-5 rounded-xl border border-white/10 bg-[#11182A] hover:border-[#22D3EE]/40 transition-colors group"
              data-ocid="dashboard.link"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#5B5CF6] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[#F2F5FF] font-medium text-sm">
                  Browse Blog
                </p>
                <p className="text-[#A8B0C4] text-xs">
                  Latest articles & insights
                </p>
              </div>
            </Link>
          </div>

          {/* Mobile nav hint */}
          <div className="mt-6 md:hidden flex gap-3">
            <Link to="/tools">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] text-sm"
                data-ocid="dashboard.link"
              >
                AI Tools
              </button>
            </Link>
            <Link to="/blog">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] text-sm"
                data-ocid="dashboard.link"
              >
                Blog
              </button>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm"
              data-ocid="dashboard.secondary_button"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
