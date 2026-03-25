import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetBlogPostById } from "../hooks/useQueries";

const FALLBACK_POSTS: Record<
  string,
  {
    title: string;
    content: string;
    author: string;
    imageUrl: string;
    category: string;
    timestamp: bigint;
  }
> = {
  "1": {
    title: "How Large Language Models Are Reshaping Software Development",
    content:
      "Large language models (LLMs) have fundamentally transformed how software is built. From AI-powered code completion to automated documentation and test generation, LLMs are becoming integral to every phase of the software development lifecycle.\n\nThe most immediate impact has been on developer productivity. Tools like GitHub Copilot and similar assistants now handle repetitive boilerplate, suggest implementations based on natural language descriptions, and even identify bugs before they reach production.\n\nBut the transformation goes deeper than tooling. LLMs are reshaping how teams think about system design, enabling non-engineers to contribute meaningfully to technical discussions through natural language interfaces to codebases.\n\nLooking ahead, the combination of LLMs with formal verification tools, test frameworks, and deployment pipelines promises a future where software quality and delivery speed improve in tandem — rather than trading one off against the other.",
    author: "Sarah Chen",
    imageUrl: "/assets/generated/blog-ai-models.dim_400x240.jpg",
    category: "AI Research",
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  "2": {
    title: "Building Automated Workflows That Scale",
    content:
      "Workflow automation has been a core engineering challenge for decades. But the emergence of AI-native platforms has unlocked new patterns that were previously impractical at scale.\n\nTraditional automation relied on rigid, rule-based systems. A workflow was a flowchart: if X then Y. AI-native workflows are different — they can handle ambiguous inputs, infer intent, and adapt to context without explicit programming.\n\nThe key architectural shift is from deterministic pipelines to probabilistic ones. Instead of routing every request through a fixed decision tree, modern AI workflows route based on semantic understanding of the task at hand.\n\nFor engineering teams, this means embracing new design patterns: orchestration over implementation, evaluation harnesses over unit tests, and observability tooling built for non-deterministic outputs.",
    author: "Marcus Reid",
    imageUrl: "/assets/generated/blog-workflows.dim_400x240.jpg",
    category: "Engineering",
    timestamp: BigInt((Date.now() - 86400000 * 3) * 1_000_000),
  },
  "3": {
    title: "Why Team Collaboration Tools Need an AI-First Redesign",
    content:
      "The tools teams use to collaborate were designed for a pre-AI world. Email threads, project management boards, and document editors all assume that humans are the primary actors — creating, editing, and deciding.\n\nAs AI takes on more cognitive labor, collaboration tools need to adapt. The question is no longer just 'who is working on what' but 'which tasks are being handled by humans vs. AI agents, and how do the two coordinate?'\n\nEffective AI-first collaboration platforms need to make AI contributions legible to human teammates. This means surfaces for reviewing AI-generated work, mechanisms for providing feedback that improves future AI behavior, and clear attribution when outputs are AI-assisted.\n\nThe teams that figure this out first will have a significant productivity advantage — not because they have better AI, but because they've built better interfaces between humans and their AI collaborators.",
    author: "Elena Vasquez",
    imageUrl: "/assets/generated/blog-teams.dim_400x240.jpg",
    category: "Product",
    timestamp: BigInt((Date.now() - 86400000 * 7) * 1_000_000),
  },
};

export default function BlogPostPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const { data: post, isLoading } = useGetBlogPostById(id ? BigInt(id) : null);

  const fallback = FALLBACK_POSTS[id ?? ""];
  const displayPost = post ?? fallback;

  const dateStr = displayPost?.timestamp
    ? new Date(Number(displayPost.timestamp) / 1_000_000).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" },
      )
    : "March 2026";

  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#A8B0C4] hover:text-[#F2F5FF] text-sm mb-8 transition-colors"
          data-ocid="blogpost.link"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {isLoading && !fallback ? (
          <div className="space-y-4" data-ocid="blogpost.loading_state">
            <Skeleton className="h-8 w-3/4 bg-white/5" />
            <Skeleton className="h-4 w-1/2 bg-white/5" />
            <Skeleton className="aspect-video w-full bg-white/5 rounded-xl" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-5/6 bg-white/5" />
          </div>
        ) : displayPost ? (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs border border-[#8B5CF6]/30">
                {displayPost.category}
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F2F5FF] mb-4 leading-tight">
              {displayPost.title}
            </h1>
            <div className="flex items-center gap-4 text-[#A8B0C4] text-sm mb-8">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {displayPost.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {dateStr}
              </span>
            </div>
            <div className="rounded-xl overflow-hidden mb-8 aspect-video">
              <img
                src={displayPost.imageUrl}
                alt={displayPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="prose prose-invert prose-lg max-w-none">
              {displayPost.content.split("\n\n").map((paragraph) => (
                <p
                  key={paragraph.slice(0, 30)}
                  className="text-[#A8B0C4] leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.article>
        ) : (
          <div className="text-center py-20" data-ocid="blogpost.error_state">
            <p className="text-[#A8B0C4]">Post not found.</p>
            <Link
              to="/blog"
              className="text-[#8B5CF6] hover:underline mt-2 inline-block"
              data-ocid="blogpost.link"
            >
              Back to Blog
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
