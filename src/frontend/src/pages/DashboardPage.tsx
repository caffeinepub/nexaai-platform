import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BookMarked,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  Clock,
  Code2,
  Crown,
  FileText,
  History,
  ImageIcon,
  Key,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageCircle,
  Mic,
  PenTool,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  UserCircle,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { getCurrentUser, logout } from "../hooks/useAuth";

interface AIHistoryEntry {
  id: bigint;
  toolName: string;
  input: string;
  output: string;
  timestamp: bigint;
}

const PRO_STORAGE_KEY = "nexaai_pro_users";

function getProUsers(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PRO_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setUserPro(email: string) {
  const list = getProUsers();
  if (!list.includes(email)) {
    list.push(email);
    localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(list));
  }
}

function isUserPro(email: string): boolean {
  return getProUsers().includes(email);
}

const FALLBACK_VALID_KEYS = ["AYAN"];

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

const PRO_STATS = [
  {
    label: "API Access",
    value: "Unlimited",
    icon: <BrainCircuit className="w-5 h-5" />,
    color: "from-yellow-400 to-orange-500",
  },
  {
    label: "Priority Support",
    value: "24/7",
    icon: <Star className="w-5 h-5" />,
    color: "from-orange-400 to-yellow-500",
  },
  {
    label: "Advanced Analytics",
    value: "Full",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-yellow-500 to-amber-600",
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

const TOOL_ICONS: Record<string, React.ReactNode> = {
  "Text Summarizer": <FileText className="w-3.5 h-3.5" />,
  "AI Chat": <MessageCircle className="w-3.5 h-3.5" />,
  "Content Generator": <PenTool className="w-3.5 h-3.5" />,
  "Code Generator": <Code2 className="w-3.5 h-3.5" />,
  "Grammar Checker": <CheckCircle className="w-3.5 h-3.5" />,
  "Voice to Text": <Mic className="w-3.5 h-3.5" />,
  "Image Generation": <ImageIcon className="w-3.5 h-3.5" />,
};

const TOOL_COLORS: Record<string, string> = {
  "Text Summarizer": "bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30",
  "AI Chat": "bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/30",
  "Content Generator": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Code Generator": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Grammar Checker": "bg-green-500/20 text-green-400 border-green-500/30",
  "Voice to Text": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Image Generation": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

function formatRelativeTime(timestampNs: bigint): string {
  const ms = Number(timestampNs) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ms).toLocaleDateString();
}

type ActiveSection = "overview" | "history";

export default function DashboardPage() {
  const currentUser = getCurrentUser();
  const { actor, isFetching } = useActor();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [isPro, setIsPro] = useState<boolean>(
    currentUser ? isUserPro(currentUser.email) : false,
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [activating, setActivating] = useState(false);

  const [history, setHistory] = useState<AIHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isCallerAdmin()
      .then((admin) => setIsAdmin(admin))
      .catch(() => {});
  }, [actor, isFetching]);

  useEffect(() => {
    if (activeSection !== "history" || !actor || isFetching) return;
    setHistoryLoading(true);
    actor
      .getMyHistory()
      .then((entries: AIHistoryEntry[]) => setHistory(entries))
      .catch(() => toast.error("Could not load history."))
      .finally(() => setHistoryLoading(false));
  }, [activeSection, actor, isFetching]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleActivate = async () => {
    const key = licenseKey.trim().toUpperCase();
    if (!key || !currentUser) return;
    setActivating(true);
    // Fast local check first -- instant unlock for known keys
    const localValid = FALLBACK_VALID_KEYS.includes(key);
    if (localValid) {
      setUserPro(currentUser.email);
      setIsPro(true);
      setLicenseKey("");
      toast.success("Pro unlock ho gaya! Welcome to NexaAI Pro.");
      setActivating(false);
      // Background sync with backend (no await -- non-blocking)
      if (actor) actor.activateKey(key).catch(() => {});
      return;
    }
    // Key not in local list -- check backend (may be admin-generated custom key)
    try {
      let valid = false;
      if (actor) {
        try {
          valid = await actor.activateKey(key);
        } catch {
          valid = false;
        }
      }
      if (valid) {
        setUserPro(currentUser.email);
        setIsPro(true);
        setLicenseKey("");
        toast.success("Pro unlock ho gaya! Welcome to NexaAI Pro.");
      } else {
        toast.error("Invalid key. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setActivating(false);
    }
  };

  const handleClearHistory = async () => {
    if (!actor) return;
    setClearingHistory(true);
    try {
      await actor.clearMyHistory();
      setHistory([]);
      toast.success("History cleared.");
    } catch {
      toast.error("Could not clear history.");
    } finally {
      setClearingHistory(false);
    }
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "Overview",
      section: "overview" as ActiveSection,
    },
    {
      icon: <History className="w-4 h-4" />,
      label: "History",
      section: "history" as ActiveSection,
    },
    { icon: <Wrench className="w-4 h-4" />, label: "AI Tools", href: "/tools" },
    { icon: <BookOpen className="w-4 h-4" />, label: "Blog", href: "/blog" },
    {
      icon: <UserCircle className="w-4 h-4" />,
      label: "Profile",
      href: "/profile",
    },
  ];

  const displayName = currentUser?.name || currentUser?.email || "User";

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
          {navItems.map((item) => {
            const isActive = item.section
              ? activeSection === item.section
              : false;
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#A8B0C4] hover:bg-white/5 hover:text-[#F2F5FF] transition-colors"
                  data-ocid="dashboard.link"
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveSection(item.section!)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors ${
                  isActive
                    ? "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/20"
                    : "text-[#A8B0C4] hover:bg-white/5 hover:text-[#F2F5FF]"
                }`}
                data-ocid="dashboard.tab"
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors"
              data-ocid="dashboard.link"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-3 px-3 py-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[#A8B0C4] text-xs">Logged in as</p>
              {isPro && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-[10px] px-1.5 py-0 leading-4">
                  PRO
                </Badge>
              )}
            </div>
            <p className="text-[#F2F5FF] text-xs truncate">{displayName}</p>
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
          {activeSection === "overview" && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F5FF]">
                    Welcome back, {displayName} 👋
                  </h1>
                  {isPro && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20"
                      data-ocid="dashboard.panel"
                    >
                      <Crown className="w-3 h-3" /> PRO
                    </motion.div>
                  )}
                </div>
                <p className="text-[#A8B0C4] text-sm">{currentUser?.email}</p>
              </div>

              {!isPro && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                  data-ocid="dashboard.card"
                >
                  <div className="p-6 rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/10 to-[#22D3EE]/5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shrink-0">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-heading font-bold text-[#F2F5FF] text-lg mb-1">
                          Activate License Key
                        </h2>
                        <p className="text-[#A8B0C4] text-sm mb-4">
                          Enter your license key to unlock Pro features:
                          advanced analytics, priority support, unlimited API
                          access, and more.
                        </p>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <Input
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleActivate()
                            }
                            placeholder="e.g. AYAN"
                            className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 font-mono focus:border-[#8B5CF6]/50 flex-1"
                            data-ocid="dashboard.input"
                          />
                          <Button
                            onClick={handleActivate}
                            disabled={activating || !licenseKey.trim()}
                            className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 shrink-0"
                            data-ocid="dashboard.submit_button"
                          >
                            {activating ? (
                              <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                                Activating...
                              </>
                            ) : (
                              <>
                                <Zap className="mr-2 w-4 h-4" /> Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Admin Panel button -- right below key section, only for admins */}
                  {isAdmin && (
                    <div className="mt-3">
                      <Link
                        to="/admin"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm font-medium hover:bg-[#8B5CF6]/20 transition-colors"
                        data-ocid="dashboard.link"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel -- Manage License Keys
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {isPro && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  {/* Admin Panel button -- next to Pro section for admins */}
                  {isAdmin && (
                    <div className="mb-4">
                      <Link
                        to="/admin"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm font-medium hover:bg-[#8B5CF6]/20 transition-colors"
                        data-ocid="dashboard.link"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel -- Manage License Keys
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <h2 className="font-heading font-semibold text-[#F2F5FF]">
                      Pro Features
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-yellow-400/30 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {PRO_STATS.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-5 rounded-xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/5 to-orange-500/5"
                        data-ocid="dashboard.card"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}
                        >
                          {stat.icon}
                        </div>
                        <p className="font-heading font-bold text-xl text-[#F2F5FF]">
                          {stat.value}
                        </p>
                        <p className="text-[#A8B0C4] text-xs mt-0.5">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

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
                    <p className="text-[#A8B0C4] text-xs mt-0.5">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>

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
                        <p className="text-[#A8B0C4] text-xs mt-0.5">
                          {item.tool}
                        </p>
                      </div>
                      <span className="text-[#A8B0C4] text-xs">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

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

              <div className="mt-6 md:hidden flex gap-3 flex-wrap">
                <Link to="/tools">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] text-sm"
                    data-ocid="dashboard.link"
                  >
                    AI Tools
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveSection("history")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-[#A8B0C4] text-sm"
                  data-ocid="dashboard.tab"
                >
                  <History className="w-3.5 h-3.5" /> History
                </button>
                <Link to="/blog">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] text-sm"
                    data-ocid="dashboard.link"
                  >
                    Blog
                  </button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm"
                      data-ocid="dashboard.link"
                    >
                      <Shield className="w-3.5 h-3.5" /> Admin
                    </button>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm"
                  data-ocid="dashboard.secondary_button"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </>
          )}

          {activeSection === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F5FF]">
                    AI Tool History
                  </h1>
                  <p className="text-[#A8B0C4] text-sm mt-1">
                    Your past AI tool usage — saved across sessions.
                  </p>
                </div>
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearHistory}
                    disabled={clearingHistory}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 shrink-0"
                    data-ocid="dashboard.delete_button"
                  >
                    {clearingHistory ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Clear All
                  </Button>
                )}
              </div>

              {historyLoading && (
                <div
                  className="flex items-center justify-center py-20"
                  data-ocid="dashboard.loading_state"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
                </div>
              )}

              {!historyLoading && history.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center py-20 text-center"
                  data-ocid="dashboard.empty_state"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#11182A] border border-white/10 flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-[#A8B0C4]" />
                  </div>
                  <p className="text-[#F2F5FF] font-medium mb-2">
                    No history yet
                  </p>
                  <p className="text-[#A8B0C4] text-sm max-w-xs">
                    Use any AI tool and your results will be saved here for
                    future reference.
                  </p>
                  <Link to="/tools" className="mt-4">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0"
                      data-ocid="dashboard.primary_button"
                    >
                      <Wrench className="w-3.5 h-3.5 mr-1.5" /> Explore Tools
                    </Button>
                  </Link>
                </div>
              )}

              {!historyLoading && history.length > 0 && (
                <ScrollArea className="h-[600px] pr-2">
                  <div className="space-y-3">
                    {history.map((entry, i) => {
                      const badgeClass =
                        TOOL_COLORS[entry.toolName] ??
                        "bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30";
                      const toolIcon = TOOL_ICONS[entry.toolName];
                      return (
                        <motion.div
                          key={String(entry.id)}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="p-4 rounded-xl border border-white/10 bg-[#11182A] hover:border-white/20 transition-colors"
                          data-ocid={`dashboard.item.${i + 1}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}
                            >
                              {toolIcon}
                              {entry.toolName}
                            </span>
                            <span className="text-[#A8B0C4] text-xs shrink-0">
                              {formatRelativeTime(entry.timestamp)}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-[#A8B0C4] text-[10px] uppercase tracking-wider mb-0.5">
                                Input
                              </p>
                              <p className="text-[#F2F5FF] text-sm line-clamp-2">
                                {entry.input.length > 160
                                  ? `${entry.input.slice(0, 160)}...`
                                  : entry.input}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#A8B0C4] text-[10px] uppercase tracking-wider mb-0.5">
                                Output
                              </p>
                              <p className="text-[#A8B0C4] text-sm line-clamp-2">
                                {entry.output.length > 200
                                  ? `${entry.output.slice(0, 200)}...`
                                  : entry.output}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
