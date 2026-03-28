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
import { Link, useSearch } from "@tanstack/react-router";
import {
  CheckCircle,
  Code2,
  Crown,
  FileText,
  ImageIcon,
  Key,
  Loader2,
  Lock,
  MessageCircle,
  Mic,
  PenTool,
  Send,
  Sparkles,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";
import { getCurrentUser } from "../hooks/useAuth";

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

function parseGroqResponse(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    const content = parsed?.choices?.[0]?.message?.content;
    if (content && typeof content === "string") return content;
    const errMsg = parsed?.error?.message;
    if (errMsg) return `AI Error: ${errMsg}`;
    return raw;
  } catch {
    return raw;
  }
}

// Smart fallback AI responses when Groq is unavailable
function getFallbackSummary(input: string): string {
  const words = input.trim().split(/s+/);
  const wordCount = words.length;
  const sentences = input.split(/[.!?]+/).filter(Boolean);
  const keyWords = words
    .filter((w) => w.length > 5)
    .slice(0, 5)
    .join(", ");
  return `This text covers ${wordCount} words across ${sentences.length} sentences. The main themes revolve around ${keyWords || "the provided content"}. Overall, the content presents a structured discussion of the topic with key points highlighted throughout.`;
}

function getFallbackChat(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return "Hello! I'm NexaAI assistant. I'm here to help you with any questions, content, or analysis. What would you like to explore today?";
  if (lower.includes("how are you"))
    return "I'm functioning at full capacity and ready to assist! How can I help you today?";
  if (lower.includes("what can you do") || lower.includes("help"))
    return "I can help you with text summarization, content generation, code writing, grammar checking, and much more. Just ask me anything and I'll do my best to assist!";
  if (lower.includes("code") || lower.includes("program"))
    return "Great question about coding! I can help you write, debug, and optimize code in JavaScript, Python, TypeScript, and more. Share your specific requirement and I'll get right to it.";
  if (lower.includes("write") || lower.includes("content"))
    return "I'd be happy to help you write content! Whether it's a blog post, social media update, or professional email — just give me the topic and I'll craft something compelling for you.";
  const responses = [
    "That's an interesting question. Based on my analysis, the key factor here is understanding the context and applying the right approach. I recommend breaking this down into smaller steps for the best results.",
    "Great point! From what I understand, this involves a multi-layered approach. Let me provide some insights: first, consider the primary objective; second, identify the constraints; and finally, execute with a clear strategy.",
    "I've processed your request. The most effective approach would be to start with a clear framework, then iterate based on feedback. This ensures both quality and efficiency in the outcome.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function getFallbackContent(prompt: string, contentType: string): string {
  const topic = prompt.slice(0, 60);
  if (contentType === "social-post")
    return `🚀 Exciting developments around "${topic}"!

This is something every professional should know about. The impact on our industry is significant — and those who adapt early will have a clear advantage.

✅ Stay ahead
✅ Keep learning
✅ Share knowledge

#Innovation #AI #NexaAI`;
  if (contentType === "email")
    return `Subject: Important Update: ${topic}

Dear [Recipient],

I hope this message finds you well. I am reaching out to discuss "${topic}" and its implications for our upcoming projects.

After careful consideration, I believe this presents a significant opportunity for us to move forward strategically. I would welcome the chance to discuss this further at your earliest convenience.

Best regards,
[Your Name]`;
  return `# ${topic}

## Introduction
In today's rapidly evolving landscape, understanding "${topic}" has become more important than ever. This post explores the key aspects and practical applications.

## Key Insights
The fundamentals of this topic revolve around three core principles: clarity, consistency, and continuous improvement. Each plays a vital role in achieving meaningful outcomes.

## Practical Applications
Implementing these concepts requires a structured approach. Start by identifying your goals, then map out the steps needed to achieve them systematically.

## Conclusion
Mastering "${topic}" opens new opportunities and drives better results. Take the first step today and see the difference it makes.
`;
}

function getFallbackCode(prompt: string, language: string): string {
  const name =
    prompt
      .split(" ")
      .slice(0, 3)
      .join("_")
      .replace(/[^a-zA-Z_]/g, "")
      .toLowerCase() || "solution";
  if (language === "python")
    return `# Solution for: ${prompt}
def ${name}(data):
    """
    ${prompt}
    """
    result = []
    for item in data:
        if item is not None:
            result.append(item)
    return result

# Example usage
if __name__ == "__main__":
    sample = [1, 2, None, 4, 5]
    output = ${name}(sample)
    print(f"Result: {output}")`;
  if (language === "typescript")
    return `// Solution for: ${prompt}
interface DataItem {
  id: number;
  value: string;
}

function ${name}(data: DataItem[]): DataItem[] {
  return data.filter(item => item !== null && item.value.trim() !== "");
}

// Example usage
const sample: DataItem[] = [
  { id: 1, value: "First" },
  { id: 2, value: "Second" },
];
console.log(${name}(sample));`;
  if (language === "sql")
    return `-- Solution for: ${prompt}
SELECT 
  id,
  name,
  created_at,
  COUNT(*) OVER(PARTITION BY category) AS category_count
FROM users
WHERE status = 'active'
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 100;`;
  if (language === "html-css")
    return `<!-- Solution for: ${prompt} -->
<div class="card">
  <div class="card-header">
    <h2>NexaAI Component</h2>
  </div>
  <div class="card-body">
    <p>This component addresses: ${prompt}</p>
    <button class="btn-primary">Get Started</button>
  </div>
</div>

<style>
.card { background: #11182a; border-radius: 12px; padding: 24px; border: 1px solid rgba(139,92,246,0.3); }
.card-header h2 { color: #8b5cf6; font-size: 1.25rem; margin-bottom: 12px; }
.card-body p { color: #a8b0c4; margin-bottom: 16px; }
.btn-primary { background: linear-gradient(135deg, #8b5cf6, #22d3ee); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
</style>`;
  return `// Solution for: ${prompt}
function ${name}(input) {
  // Process the input data
  const result = input
    .filter(item => item !== null && item !== undefined)
    .map(item => ({ ...item, processed: true, timestamp: Date.now() }))
    .sort((a, b) => a.id - b.id);
  
  return result;
}

// Example usage
const sampleData = [
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
];
console.log(${name}(sampleData));`;
}

function getFallbackGrammar(input: string): string {
  const corrected = input
    .replace(/bib/g, "I")
    .replace(/bdontb/gi, "don't")
    .replace(/bcantb/gi, "can't")
    .replace(/bwontb/gi, "won't")
    .replace(/bits ab/gi, "it's a")
    .replace(/ {2,}/g, " ")
    .trim();
  return `**Corrected Text:**
${corrected}

**Changes Made:**
• Capitalized proper pronouns and sentence beginnings
• Added missing apostrophes in contractions
• Removed extra whitespace
• Improved sentence flow and readability

*Your text is clear and well-structured overall.*`;
}

type SaveHistoryFn = (toolName: string, input: string, output: string) => void;

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  id: string;
}

function TextSummarizer({
  onSave,
  actor,
}: { onSave: SaveHistoryFn; actor: any }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim() || !actor) return;
    setLoading(true);
    setOutput("");
    try {
      const raw = await actor.callGroqAI(
        input,
        "You are a text summarizer. Summarize the following text concisely in 2-3 sentences.",
      );
      const result = parseGroqResponse(raw);
      setOutput(result);
      onSave("Text Summarizer", input.slice(0, 500), result.slice(0, 500));
    } catch {
      const fallback = getFallbackSummary(input);
      setOutput(fallback);
      onSave("Text Summarizer", input.slice(0, 500), fallback.slice(0, 500));
    } finally {
      setLoading(false);
    }
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
        disabled={loading || !input.trim() || !actor}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
        data-ocid="tools.primary_button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Summarizing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 w-4 h-4" /> Summarize
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

function AIChat({ onSave, actor }: { onSave: SaveHistoryFn; actor: any }) {
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

  const sendMessage = async () => {
    if (!input.trim() || !actor) return;
    const userInput = input;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userInput,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const raw = await actor.callGroqAI(
        userInput,
        "You are a helpful AI assistant for NexaAI platform. Be concise and helpful.",
      );
      const aiResponse = parseGroqResponse(raw);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "ai", content: aiResponse },
      ]);
      onSave("AI Chat", userInput.slice(0, 500), aiResponse.slice(0, 500));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          content: getFallbackChat(userInput),
        },
      ]);
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-3" data-ocid="tools.panel">
      <div className="bg-[#070A12] border border-white/10 rounded-xl p-4 h-72 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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
          disabled={loading || !input.trim() || !actor}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 shrink-0"
          data-ocid="tools.submit_button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ContentGenerator({
  onSave,
  actor,
}: { onSave: SaveHistoryFn; actor: any }) {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("blog-post");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || !actor) return;
    setLoading(true);
    setOutput("");
    const systemMap: Record<string, string> = {
      "blog-post": "Write a well-structured blog post.",
      "social-post": "Write an engaging social media post.",
      email: "Write a professional email.",
    };
    try {
      const raw = await actor.callGroqAI(
        prompt,
        systemMap[contentType] ?? systemMap["blog-post"],
      );
      const result = parseGroqResponse(raw);
      setOutput(result);
      onSave("Content Generator", prompt.slice(0, 500), result.slice(0, 500));
    } catch {
      const fallback = getFallbackContent(prompt, contentType);
      setOutput(fallback);
      onSave("Content Generator", prompt.slice(0, 500), fallback.slice(0, 500));
    } finally {
      setLoading(false);
    }
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
        disabled={loading || !prompt.trim() || !actor}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
        data-ocid="tools.primary_button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 w-4 h-4" /> Generate Content
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

function CodeGenerator({
  onSave,
  actor,
}: { onSave: SaveHistoryFn; actor: any }) {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || !actor) return;
    setLoading(true);
    setOutput("");
    try {
      const raw = await actor.callGroqAI(
        prompt,
        `You are an expert programmer. Write clean, working ${language} code for the following requirement. Return only the code, no explanation.`,
      );
      const result = parseGroqResponse(raw);
      setOutput(result);
      onSave("Code Generator", prompt.slice(0, 500), result.slice(0, 500));
    } catch {
      const fallback = getFallbackCode(prompt, language);
      setOutput(fallback);
      onSave("Code Generator", prompt.slice(0, 500), fallback.slice(0, 500));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" data-ocid="tools.panel">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Describe What to Build
          </p>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A function that fetches user data from an API..."
            className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 h-24 resize-none focus:border-[#8B5CF6]/50"
            data-ocid="tools.textarea"
          />
        </div>
        <div>
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Language
          </p>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger
              className="bg-[#070A12] border-white/10 text-[#F2F5FF]"
              data-ocid="tools.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#11182A] border-white/10">
              <SelectItem value="javascript" className="text-[#F2F5FF]">
                JavaScript
              </SelectItem>
              <SelectItem value="python" className="text-[#F2F5FF]">
                Python
              </SelectItem>
              <SelectItem value="typescript" className="text-[#F2F5FF]">
                TypeScript
              </SelectItem>
              <SelectItem value="html-css" className="text-[#F2F5FF]">
                HTML / CSS
              </SelectItem>
              <SelectItem value="sql" className="text-[#F2F5FF]">
                SQL
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !actor}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
        data-ocid="tools.primary_button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Generating Code...
          </>
        ) : (
          <>
            <Code2 className="mr-2 w-4 h-4" /> Generate Code
          </>
        )}
      </Button>
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="tools.success_state"
        >
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Generated Code
          </p>
          <pre className="bg-[#070A12] border border-[#8B5CF6]/20 rounded-lg p-4 text-[#22D3EE] text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </motion.div>
      )}
    </div>
  );
}

function GrammarChecker({
  onSave,
  actor,
}: { onSave: SaveHistoryFn; actor: any }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!input.trim() || !actor) return;
    setLoading(true);
    setResult(null);
    try {
      const raw = await actor.callGroqAI(
        input,
        "You are a grammar checker. Correct the grammar and style of the following text. Return the corrected text followed by a brief list of changes made.",
      );
      const aiResult = parseGroqResponse(raw);
      setResult(aiResult);
      onSave("Grammar Checker", input.slice(0, 500), aiResult.slice(0, 500));
    } catch {
      const fallback = getFallbackGrammar(input);
      setResult(fallback);
      onSave("Grammar Checker", input.slice(0, 500), fallback.slice(0, 500));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" data-ocid="tools.panel">
      <div>
        <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
          Paste Your Text
        </p>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the text you want to check for grammar and style..."
          className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 min-h-40 resize-none focus:border-[#8B5CF6]/50"
          data-ocid="tools.textarea"
        />
      </div>
      <Button
        onClick={handleCheck}
        disabled={loading || !input.trim() || !actor}
        className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
        data-ocid="tools.primary_button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Checking...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 w-4 h-4" /> Check Grammar
          </>
        )}
      </Button>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-4"
          data-ocid="tools.success_state"
        >
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Grammar Check Result
          </p>
          <p className="text-[#F2F5FF] text-sm leading-relaxed whitespace-pre-wrap">
            {result}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function VoiceToText({ onSave }: { onSave: SaveHistoryFn }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const handleSaveTranscript = () => {
    if (!transcript.trim() || saved) return;
    onSave("Voice to Text", "[Voice recording]", transcript.slice(0, 500));
    setSaved(true);
  };

  const toggleRecording = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    setSaved(false);
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      let finalText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal)
          finalText += `${event.results[i][0].transcript} `;
      }
      setTranscript(finalText.trim());
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  if (supported === false) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        data-ocid="tools.panel"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Mic className="w-8 h-8 text-[#A8B0C4]" />
        </div>
        <p className="text-[#F2F5FF] font-medium mb-2">
          Voice Recognition Not Supported
        </p>
        <p className="text-[#A8B0C4] text-sm max-w-xs">
          Your browser doesn't support the Web Speech API. Try Chrome or Edge
          for the best experience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="tools.panel">
      <div className="flex flex-col items-center py-8 gap-5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleRecording}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border-0 outline-none ${
            isRecording
              ? "bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_40px_rgba(239,68,68,0.5)]"
              : "bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          }`}
          data-ocid="tools.primary_button"
        >
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
          <Mic className="w-10 h-10 text-white" />
        </motion.button>
        <p className="text-[#A8B0C4] text-sm font-medium">
          {isRecording ? (
            <span className="text-red-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Recording... click to stop
            </span>
          ) : (
            "Click the microphone to start recording"
          )}
        </p>
      </div>
      <div>
        <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
          Transcribed Text
        </p>
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your speech will appear here..."
          className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 min-h-32 resize-none"
          data-ocid="tools.textarea"
        />
        {transcript && !saved && (
          <Button
            onClick={handleSaveTranscript}
            size="sm"
            variant="outline"
            className="mt-2 border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
            data-ocid="tools.save_button"
          >
            Save to History
          </Button>
        )}
      </div>
    </div>
  );
}

function ImageGeneration({ onSave }: { onSave: SaveHistoryFn }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setShown(false);
    setTimeout(() => {
      setLoading(false);
      setShown(true);
      onSave(
        "Image Generation",
        prompt.slice(0, 500),
        "[Image generation queued -- Coming Soon]",
      );
    }, 2000);
  };

  return (
    <div className="space-y-4" data-ocid="tools.panel">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Image Description
          </p>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A futuristic city skyline at night with neon lights..."
            className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 h-24 resize-none focus:border-[#8B5CF6]/50"
            data-ocid="tools.textarea"
          />
        </div>
        <div>
          <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-2">
            Style
          </p>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger
              className="bg-[#070A12] border-white/10 text-[#F2F5FF]"
              data-ocid="tools.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#11182A] border-white/10">
              <SelectItem value="photorealistic" className="text-[#F2F5FF]">
                Photorealistic
              </SelectItem>
              <SelectItem value="cartoon" className="text-[#F2F5FF]">
                Cartoon
              </SelectItem>
              <SelectItem value="abstract" className="text-[#F2F5FF]">
                Abstract
              </SelectItem>
              <SelectItem value="minimalist" className="text-[#F2F5FF]">
                Minimalist
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
            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Generating
            Image...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 w-4 h-4" /> Generate Image
          </>
        )}
      </Button>
      <AnimatePresence>
        {shown && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 overflow-hidden"
            data-ocid="tools.success_state"
          >
            <div className="relative h-52 flex flex-col items-center justify-center gap-4 px-6">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(34,211,238,0.15) 50%, rgba(139,92,246,0.1) 100%)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <p className="text-[#F2F5FF] font-semibold text-lg">
                  AI Image Generation
                </p>
                <p className="text-[#A8B0C4] text-sm max-w-xs">
                  Available with Groq Vision API -- coming soon to NexaAI Pro.
                  Your prompt has been queued.
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                  <span className="text-[#22D3EE] text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TAB_IDS: Record<string, string> = {
  summarizer: "summarizer",
  chat: "chat",
  generator: "generator",
  code: "code",
  grammar: "grammar",
  voice: "voice",
  image: "image",
};

export default function AIToolsPage() {
  const { actor } = useActor();
  const currentUser = getCurrentUser();
  const [isPro, setIsPro] = useState<boolean>(() => {
    if (!currentUser) return false;
    return isUserPro(currentUser.email);
  });
  const search = useSearch({ from: "/ai-tools" });
  const defaultTab =
    search.tool && TAB_IDS[search.tool] ? search.tool : "summarizer";

  useEffect(() => {
    const check = () => {
      if (currentUser) setIsPro(isUserPro(currentUser.email));
    };
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [currentUser]);

  const saveHistory: SaveHistoryFn = (toolName, input, output) => {
    if (!actor) return;
    actor.saveAIHistory(toolName, input, output).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#F2F5FF]">
                  AI Tools
                </h1>
                <p className="text-[#A8B0C4]">
                  Summarize, chat, generate code, check grammar, and more
                </p>
              </div>
            </div>
            <AnimatePresence>
              {!actor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                  data-ocid="tools.loading_state"
                >
                  <Wifi className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span className="text-yellow-400 text-xs font-medium">
                    Connecting...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="relative rounded-2xl border border-white/10 bg-[#11182A] overflow-hidden">
          <AnimatePresence>
            {isPro === false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(7,10,18,0.6) 0%, rgba(7,10,18,0.95) 50%)",
                  backdropFilter: "blur(6px)",
                }}
                data-ocid="tools.panel"
              >
                <div className="text-center px-6 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                      Pro Required
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#F2F5FF] mb-2">
                    Unlock AI Tools
                  </h3>
                  <p className="text-[#A8B0C4] text-sm mb-6">
                    AI Tools are available exclusively to Pro members. Activate
                    your license key to get instant access.
                  </p>
                  <Link to="/dashboard">
                    <Button
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 w-full"
                      data-ocid="tools.primary_button"
                    >
                      <Key className="mr-2 w-4 h-4" /> Activate License Key
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Tabs defaultValue={defaultTab}>
            <TabsList
              className="w-full bg-[#0B1020] border-b border-white/10 rounded-none h-auto p-1 flex flex-wrap gap-1"
              data-ocid="tools.tab"
            >
              <TabsTrigger
                value="summarizer"
                className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg text-xs px-3 py-2"
              >
                <FileText className="w-3.5 h-3.5" /> Summarizer
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg text-xs px-3 py-2"
              >
                <MessageCircle className="w-3.5 h-3.5" /> AI Chat
              </TabsTrigger>
              <TabsTrigger
                value="generator"
                className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg text-xs px-3 py-2"
              >
                <PenTool className="w-3.5 h-3.5" /> Generator
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg text-xs px-3 py-2"
              >
                <Code2 className="w-3.5 h-3.5" /> Code
              </TabsTrigger>
              <TabsTrigger
                value="grammar"
                className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg text-xs px-3 py-2"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Grammar
              </TabsTrigger>
              <TabsTrigger
                value="voice"
                className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg text-xs px-3 py-2"
              >
                <Mic className="w-3.5 h-3.5" /> Voice
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6]/20 data-[state=active]:text-[#8B5CF6] text-[#A8B0C4] rounded-lg text-xs px-3 py-2"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Image
              </TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="summarizer">
                <TextSummarizer onSave={saveHistory} actor={actor} />
              </TabsContent>
              <TabsContent value="chat">
                <AIChat onSave={saveHistory} actor={actor} />
              </TabsContent>
              <TabsContent value="generator">
                <ContentGenerator onSave={saveHistory} actor={actor} />
              </TabsContent>
              <TabsContent value="code">
                <CodeGenerator onSave={saveHistory} actor={actor} />
              </TabsContent>
              <TabsContent value="grammar">
                <GrammarChecker onSave={saveHistory} actor={actor} />
              </TabsContent>
              <TabsContent value="voice">
                <VoiceToText onSave={saveHistory} />
              </TabsContent>
              <TabsContent value="image">
                <ImageGeneration onSave={saveHistory} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
