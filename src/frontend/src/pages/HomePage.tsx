import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  GitBranch,
  Layers,
  Play,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import BlogCard from "../components/BlogCard";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import Header from "../components/Header";

const DUMMY_BLOGS = [
  {
    id: "1",
    title: "How Large Language Models Are Reshaping Software Development",
    imageUrl: "/assets/generated/blog-ai-models.dim_400x240.jpg",
    category: "AI Research",
    author: "Sarah Chen",
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "2",
    title: "Building Automated Workflows That Scale: A Practical Guide",
    imageUrl: "/assets/generated/blog-workflows.dim_400x240.jpg",
    category: "Engineering",
    author: "Marcus Reid",
    timestamp: BigInt((Date.now() - 86400000 * 3) * 1_000_000),
  },
  {
    id: "3",
    title: "Why Team Collaboration Tools Need an AI-First Redesign",
    imageUrl: "/assets/generated/blog-teams.dim_400x240.jpg",
    category: "Product",
    author: "Elena Vasquez",
    timestamp: BigInt((Date.now() - 86400000 * 7) * 1_000_000),
  },
];

const FEATURES = [
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Model Management",
    description:
      "Organize, version, and deploy AI models across your organization with a unified control plane.",
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Automated Workflows",
    description:
      "Build powerful pipelines that trigger, route, and process AI tasks without manual intervention.",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Compute Scaling",
    description:
      "Autoscale inference workloads based on demand. Pay only for what you use, never overprovision.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Team Collaboration",
    description:
      "Share prompts, results, and models across teams with granular permissions and audit logs.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "NexaAI transformed how our engineering team works with AI. The workflow automation alone saved us 20+ hours per week.",
    author: "Jordan Park",
    role: "VP of Engineering, Pulsar Labs",
    avatar: "JP",
  },
  {
    quote:
      "The model management dashboard is exactly what we needed. Clean, fast, and scales effortlessly as we grow.",
    author: "Amara Osei",
    role: "ML Lead, DataBridge",
    avatar: "AO",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                Now in public beta
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#F2F5FF] mb-6">
                The Complete AI Platform for{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#5B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                  Modern Teams.
                </span>
              </h1>
              <p className="text-[#A8B0C4] text-lg leading-relaxed mb-8 max-w-lg">
                Manage models, automate workflows, scale compute, and
                collaborate — all in one integrated platform built for the
                AI-native era.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 transition-opacity"
                    data-ocid="hero.primary_button"
                  >
                    Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-[#F2F5FF] hover:bg-white/5"
                  data-ocid="hero.secondary_button"
                >
                  <Play className="mr-2 w-4 h-4" /> Watch Video
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-[#A8B0C4]">
                <span>✓ No credit card required</span>
                <span>✓ 14-day free trial</span>
                <span>✓ Cancel anytime</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#22D3EE]/20 rounded-3xl blur-3xl" />
              <img
                src="/assets/generated/hero-ai-network.dim_600x500.png"
                alt="AI Network visualization"
                className="relative rounded-2xl border border-white/10 shadow-glow animate-float max-w-full"
              />
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#F2F5FF] mb-4">
                Everything your team needs
              </h2>
              <p className="text-[#A8B0C4] text-lg max-w-xl mx-auto">
                From model deployment to team workflows — NexaAI covers the full
                AI lifecycle.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <FeatureCard {...f} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 bg-[#0B1020]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#F2F5FF] mb-12">
                Loved by engineering teams
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {TESTIMONIALS.map((t) => (
                  <div
                    key={t.author}
                    className="p-6 rounded-xl border border-white/10 bg-[#11182A] text-left"
                  >
                    <div className="flex mb-4">
                      <Star
                        key="s1"
                        className="w-4 h-4 fill-[#8B5CF6] text-[#8B5CF6]"
                      />
                      <Star
                        key="s2"
                        className="w-4 h-4 fill-[#8B5CF6] text-[#8B5CF6]"
                      />
                      <Star
                        key="s3"
                        className="w-4 h-4 fill-[#8B5CF6] text-[#8B5CF6]"
                      />
                      <Star
                        key="s4"
                        className="w-4 h-4 fill-[#8B5CF6] text-[#8B5CF6]"
                      />
                      <Star
                        key="s5"
                        className="w-4 h-4 fill-[#8B5CF6] text-[#8B5CF6]"
                      />
                    </div>
                    <p className="text-[#F2F5FF] text-sm leading-relaxed mb-4">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white text-xs font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-[#F2F5FF] text-sm font-semibold">
                          {t.author}
                        </p>
                        <p className="text-[#A8B0C4] text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Insights */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="font-heading font-bold text-3xl text-[#F2F5FF]">
                  Blog Insights
                </h2>
                <p className="text-[#A8B0C4] mt-1">
                  Latest from the NexaAI team
                </p>
              </div>
              <Link
                to="/blog"
                className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#22D3EE] text-sm font-medium transition-colors"
                data-ocid="blog.link"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {DUMMY_BLOGS.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <BlogCard post={post} index={i + 1} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Tools Preview */}
        <section className="py-20 px-4 sm:px-6 bg-[#0B1020]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#F2F5FF] mb-4">
                  AI Tools,{" "}
                  <span className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                    ready to use
                  </span>
                </h2>
                <p className="text-[#A8B0C4] text-lg mb-6">
                  Summarize text, generate content, and chat with AI assistants
                  — all built into your workspace.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Text Summarizer",
                    "AI Chat Assistant",
                    "Content Generator",
                  ].map((tool) => (
                    <li
                      key={tool}
                      className="flex items-center gap-2 text-[#A8B0C4] text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                      {tool}
                    </li>
                  ))}
                </ul>
                <Link to="/tools">
                  <Button
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
                    data-ocid="tools.primary_button"
                  >
                    Try AI Tools <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="rounded-xl border border-white/10 bg-[#11182A] overflow-hidden shadow-glow">
                  <div className="border-b border-white/10 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[#A8B0C4] text-xs ml-2">
                      Text Summarizer
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-1.5">
                        Input
                      </p>
                      <div className="rounded-lg border border-white/10 bg-[#070A12] p-3 text-[#A8B0C4] text-sm">
                        Large language models represent a significant leap in AI
                        capabilities, enabling nuanced understanding and
                        generation of human language at unprecedented scale...
                      </div>
                    </div>
                    <div className="h-px bg-white/10 my-3" />
                    <div>
                      <p className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-1.5">
                        Output
                      </p>
                      <div className="rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-3 text-[#F2F5FF] text-sm">
                        LLMs represent a major AI advancement, enabling
                        sophisticated language understanding and generation at
                        scale.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F2F5FF] mb-4">
                Ready to build with AI?
              </h2>
              <p className="text-[#A8B0C4] text-lg mb-8">
                Join thousands of teams using NexaAI to ship faster, smarter,
                and more collaboratively.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
                    data-ocid="cta.primary_button"
                  >
                    Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-[#F2F5FF] hover:bg-white/5"
                    data-ocid="cta.secondary_button"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
