import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";

const PRO_STORAGE_KEY = "nexaai_pro_users";
function isUserPro(email: string): boolean {
  try {
    const list: string[] = JSON.parse(
      localStorage.getItem(PRO_STORAGE_KEY) || "[]",
    );
    return list.includes(email);
  } catch {
    return false;
  }
}
import {
  CheckSquare,
  Code2,
  FileText,
  ImageIcon,
  Key,
  MessageCircle,
  Mic,
  PenTool,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getCurrentUser } from "../hooks/useAuth";

const TOOLS = [
  {
    id: "summarizer",
    icon: FileText,
    name: "Text Summarizer",
    description:
      "Summarize any text instantly. Paste an article, report, or document and get a concise summary.",
    accent: "from-[#8B5CF6] to-[#6D4ED1]",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    id: "chat",
    icon: MessageCircle,
    name: "AI Chat",
    description:
      "Chat with your AI assistant in real time. Ask questions, brainstorm, or get help with any topic.",
    accent: "from-[#8B5CF6] to-[#22D3EE]",
    glow: "rgba(34,211,238,0.25)",
  },
  {
    id: "generator",
    icon: PenTool,
    name: "Content Generator",
    description:
      "Generate blog posts, social media posts, emails, and more with a single prompt.",
    accent: "from-[#22D3EE] to-[#8B5CF6]",
    glow: "rgba(34,211,238,0.3)",
  },
  {
    id: "code",
    icon: Code2,
    name: "Code Generator",
    description:
      "Write code in any language. Describe what you need and get production-ready code instantly.",
    accent: "from-[#5B5CF6] to-[#22D3EE]",
    glow: "rgba(91,92,246,0.3)",
  },
  {
    id: "grammar",
    icon: CheckSquare,
    name: "Grammar Checker",
    description:
      "Fix grammar, improve clarity, and polish your writing with AI-powered suggestions.",
    accent: "from-[#8B5CF6] to-[#A855F7]",
    glow: "rgba(168,85,247,0.3)",
  },
  {
    id: "voice",
    icon: Mic,
    name: "Voice to Text",
    description:
      "Convert speech to text in real time using your microphone. Fast and accurate transcription.",
    accent: "from-[#22D3EE] to-[#5B5CF6]",
    glow: "rgba(34,211,238,0.25)",
  },
  {
    id: "image",
    icon: ImageIcon,
    name: "Image Generation",
    description:
      "Generate stunning AI images from text descriptions. Coming soon to NexaAI Pro.",
    accent: "from-[#A855F7] to-[#22D3EE]",
    glow: "rgba(168,85,247,0.25)",
    badge: "Coming Soon",
  },
];

export default function ToolsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isPro = currentUser ? isUserPro(currentUser.email) : false;

  const handleToolClick = (toolId: string) => {
    if (!isPro) {
      navigate({ to: "/dashboard" });
      return;
    }
    navigate({ to: "/ai-tools", search: { tool: toolId } });
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> AI Toolbox
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-4">
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#22D3EE] bg-clip-text text-transparent">
              All AI Tools
            </span>
            <br />
            <span className="text-[#F2F5FF]">in One Place</span>
          </h1>
          <p className="text-[#A8B0C4] text-lg max-w-xl mx-auto">
            Supercharge your workflow with 7 powerful AI tools. Summarize,
            generate, code, and more — all Pro-unlocked.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="group relative rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: `0 0 0 0 ${tool.glow}` }}
                whileHover={{ boxShadow: `0 8px 40px -8px ${tool.glow}` }}
                data-ocid="tools.card"
              >
                {/* Gradient border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${tool.glow} 0%, transparent 60%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Badge */}
                  {tool.badge && (
                    <span className="absolute top-0 right-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  )}

                  <h3 className="font-heading font-bold text-[#F2F5FF] text-lg mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-[#A8B0C4] text-sm leading-relaxed mb-5">
                    {tool.description}
                  </p>

                  <Button
                    size="sm"
                    onClick={() => handleToolClick(tool.id)}
                    className={`bg-gradient-to-r ${tool.accent} text-white border-0 hover:opacity-90 w-full`}
                    data-ocid="tools.primary_button"
                  >
                    {isPro ? (
                      <>
                        <Zap className="w-3.5 h-3.5 mr-1.5" /> Use Tool
                      </>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5 mr-1.5" /> Activate Pro
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-14 text-center rounded-2xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6]/5 to-[#22D3EE]/5 p-10"
          data-ocid="tools.section"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-[#F2F5FF] mb-2">
            Ready to unlock all tools?
          </h2>
          <p className="text-[#A8B0C4] mb-6 max-w-sm mx-auto">
            All tools require a Pro license. Activate your key in the dashboard
            and get instant access.
          </p>
          <Link to="/dashboard">
            <Button
              className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 px-8"
              data-ocid="tools.primary_button"
            >
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
