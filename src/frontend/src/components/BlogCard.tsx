import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

interface BlogCardPost {
  id: string | number | bigint;
  title: string;
  imageUrl: string;
  category: string;
  timestamp?: bigint | number;
  author?: string;
}

interface BlogCardProps {
  post: BlogCardPost;
  index?: number;
}

export default function BlogCard({ post, index = 1 }: BlogCardProps) {
  const dateStr = post.timestamp
    ? new Date(Number(post.timestamp) / 1_000_000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Mar 2026";

  return (
    <Link
      to="/blog/$id"
      params={{ id: String(post.id) }}
      className="block group rounded-xl border border-white/10 bg-[#11182A] overflow-hidden hover:scale-105 transition-all duration-200 hover:border-[#8B5CF6]/40"
      data-ocid={`blog.item.${index}`}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30 text-xs">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 text-[#A8B0C4] text-xs">
            <Calendar className="w-3 h-3" />
            {dateStr}
          </span>
        </div>
        <h3 className="font-heading font-semibold text-[#F2F5FF] text-base leading-snug group-hover:text-[#8B5CF6] transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.author && (
          <p className="text-[#A8B0C4] text-xs mt-2">By {post.author}</p>
        )}
      </div>
    </Link>
  );
}
