import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPostById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost | null>({
    queryKey: ["blogPost", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getBlogPostById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}
