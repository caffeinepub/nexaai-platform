import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import BlogCard from "../components/BlogCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetAllBlogPosts } from "../hooks/useQueries";

const FALLBACK_POSTS = [
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
  {
    id: "4",
    title: "Compute Costs in the Age of Foundation Models",
    imageUrl: "/assets/generated/blog-ai-models.dim_400x240.jpg",
    category: "Infrastructure",
    author: "James Lin",
    timestamp: BigInt((Date.now() - 86400000 * 12) * 1_000_000),
  },
  {
    id: "5",
    title: "Prompt Engineering Best Practices for Production Apps",
    imageUrl: "/assets/generated/blog-workflows.dim_400x240.jpg",
    category: "Engineering",
    author: "Priya Sharma",
    timestamp: BigInt((Date.now() - 86400000 * 15) * 1_000_000),
  },
  {
    id: "6",
    title: "The Future of Knowledge Work: AI as a Collaborator",
    imageUrl: "/assets/generated/blog-teams.dim_400x240.jpg",
    category: "Trends",
    author: "David Chen",
    timestamp: BigInt((Date.now() - 86400000 * 20) * 1_000_000),
  },
];

export default function BlogPage() {
  const { data: posts, isLoading } = useGetAllBlogPosts();
  const displayPosts = posts && posts.length > 0 ? posts : FALLBACK_POSTS;

  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#F2F5FF]">
                Blog Insights
              </h1>
              <p className="text-[#A8B0C4]">
                Thoughts, guides, and updates from the NexaAI team
              </p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="blog.loading_state"
          >
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="rounded-xl border border-white/10 bg-[#11182A] overflow-hidden"
              >
                <Skeleton className="aspect-video w-full bg-white/5" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20 bg-white/5" />
                  <Skeleton className="h-5 w-full bg-white/5" />
                  <Skeleton className="h-5 w-4/5 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post, i) => (
              <motion.div
                key={String(post.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <BlogCard
                  post={{ ...post, id: String(post.id) }}
                  index={i + 1}
                />
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && displayPosts.length === 0 && (
          <div className="text-center py-20" data-ocid="blog.empty_state">
            <BookOpen className="w-12 h-12 text-[#A8B0C4] mx-auto mb-4" />
            <p className="text-[#A8B0C4]">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
