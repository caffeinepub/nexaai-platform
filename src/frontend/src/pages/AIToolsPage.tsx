import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Loader2,
  MessageCircle,
  PenTool,
  Send,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  id: string;
}

const AI_RESPONSES = [
  "That's a great question! Based on my analysis, here's what I think: AI systems work best when they're grounded in specific domain knowledge while remaining flexible enough to generalize across related tasks.",
  "Excellent point. The key insight here is that modern AI tools are most effective when integrated early into the workflow rather than bolted on after the fact.",
  "I've processed your input. The core pattern I see is a need for iterative refinement — starting with a broad framing and progressively narrowing to the specific outcome you're targeting.",
  "Great context. Building on that, I'd suggest exploring the intersection of your goal with existing frameworks. This often reveals shortcuts that aren't obvious from first principles.",
];

function summarize(text: string): string {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  if (sentences.length <= 2) return text.trim();
  const shortened = sentences
    .slice(0, Math.max(2, Math.floor(sentences.length * 0.35)))
    .join(". ")
    .trim();
  return `${shortened}.`;
}

function TextSummarizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      setOutput(summarize(input));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4" data-ocid="tools.panel">
      <div>
        <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
          Input Text
        </p>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here to summarize..."
          className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 min-h-40 resize-none focus:border-[#8B5CF6]/50"
          data-ocid="tools.textarea"
        />
      </div>
      <Button
        onClick={handleSummarize}
        disabled={loading || !input.trim()}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
        data-ocid="tools.primary_button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Summarizing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 w-4 h-4" />
            Summarize
          </>
        )}
      </Button>
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-4"
          data-ocid="tools.success_state"
        >
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Summary
          </p>
          <p className="text-[#F2F5FF] text-sm leading-relaxed">{output}</p>
        </motion.div>
      )}
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "ai",
      content: "Hi! I'm your NexaAI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const aiResponse =
        AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "ai", content: aiResponse },
      ]);
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3" data-ocid="tools.panel">
      <div className="bg-[#070A12] border border-white/10 rounded-xl p-4 h-72 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-[#8B5CF6] to-[#5B5CF6] text-white"
                  : "bg-[#11182A] border border-white/10 text-[#F2F5FF]"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start" data-ocid="tools.loading_state">
            <div className="bg-[#11182A] border border-white/10 px-4 py-2.5 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask anything..."
          className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 resize-none min-h-0 h-11"
          data-ocid="tools.input"
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 shrink-0"
          data-ocid="tools.submit_button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ContentGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("blog-post");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const GENERATED = {
    "blog-post":
      "# 5 Ways AI Is Transforming Modern Business\n\nArtificial intelligence is no longer a future concept — it's reshaping how companies operate right now. From automating repetitive tasks to generating strategic insights, here are five ways AI is making its mark.\n\n1. **Automated Decision Making** — AI systems can now analyze thousands of variables and recommend optimal decisions faster than any human team.\n\n2. **Hyper-Personalization** — Machine learning enables companies to tailor every customer touchpoint at scale.\n\n3. **Predictive Maintenance** — Industrial AI systems predict equipment failures before they happen, saving millions in downtime.\n\n4. **Natural Language Interfaces** — Employees can now interact with complex systems using plain English.\n\n5. **Real-Time Analytics** — AI processes streaming data instantly, enabling live business intelligence.",
    "social-post":
      "🚀 AI isn't the future — it's the present.\n\nTeams that embrace AI-native workflows today will define the industry benchmarks of tomorrow.\n\nAt NexaAI, we're building the platform that makes this transition seamless. Model management, automated workflows, and team collaboration — all in one place.\n\nWhat's your biggest challenge with AI adoption? Drop it in the comments 👇\n\n#AI #Productivity #NexaAI #FutureOfWork",
    email:
      "Subject: Your AI Platform Advantage Starts Here\n\nHi [Name],\n\nI wanted to reach out about how teams like yours are using NexaAI to cut AI integration time from weeks to hours.\n\nHere's what our users typically see in the first 30 days:\n• 40% reduction in time spent on manual AI workflows\n• 3x faster model deployment cycles\n• Significant improvement in cross-team AI knowledge sharing\n\nWould you be open to a 20-minute walk-through? I'd love to show you how [Company] could benefit.\n\nBest,\nThe NexaAI Team",
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      setOutput(
        GENERATED[contentType as keyof typeof GENERATED] ??
          GENERATED["blog-post"],
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4" data-ocid="tools.panel">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Your Topic or Prompt
          </p>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Write about AI trends in 2026..."
            className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 h-24 resize-none focus:border-[#8B5CF6]/50"
            data-ocid="tools.textarea"
          />
        </div>
        <div>
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Content Type
          </p>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger
              className="bg-[#070A12] border-white/10 text-[#F2F5FF]"
              data-ocid="tools.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#11182A] border-white/10">
              <SelectItem value="blog-post" className="text-[#F2F5FF]">
                Blog Post
              </SelectItem>
              <SelectItem value="social-post" className="text-[#F2F5FF]">
                Social Post
              </SelectItem>
              <SelectItem value="email" className="text-[#F2F5FF]">
                Email
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
        data-ocid="tools.primary_button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 w-4 h-4" />
            Generate Content
          </>
        )}
      </Button>
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/5 p-4"
          data-ocid="tools.success_state"
        >
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Generated Content
          </p>
          <pre className="text-[#F2F5FF] text-sm leading-relaxed whitespace-pre-wrap font-body">
            {output}
          </pre>
        </motion.div>
      )}
    </div>
  );
}

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#F2F5FF]">
                AI Tools
              </h1>
              <p className="text-[#A8B0C4]">
                Summarize, chat, and generate content with AI
              </p>
            </div>
          </div>
        </motion.div>

        <div className="rounded-2xl border border-white/10 bg-[#11182A] overflow-hidden">
          <Tabs defaultValue="summarizer">
            <TabsList
              className="w-full bg-[#0B1020] border-b border-white/10 rounded-none h-auto p-1"
              data-ocid="tools.tab"
            >
              <TabsTrigger
                value="summarizer"
                className="flex items-center gap-2 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg"
              >
                <FileText className="w-4 h-4" /> Summarizer
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center gap-2 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg"
              >
                <MessageCircle className="w-4 h-4" /> AI Chat
              </TabsTrigger>
              <TabsTrigger
                value="generator"
                className="flex items-center gap-2 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg"
              >
                <PenTool className="w-4 h-4" /> Generator
              </TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="summarizer">
                <TextSummarizer />
              </TabsContent>
              <TabsContent value="chat">
                <AIChat />
              </TabsContent>
              <TabsContent value="generator">
                <ContentGenerator />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
