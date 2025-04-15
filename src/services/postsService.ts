
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Post = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  creator_name: string | null;
  creator_profession: string | null;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  like_count: number;
};

export type PostApplication = {
  id: string;
  post_id: string;
  user_id: string;
  applied_at: string;
};

export const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("castlinker_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const fetchPostById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("castlinker_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const createPost = async (post: Omit<Post, "id" | "created_at" | "updated_at" | "like_count">) => {
  try {
    const { data, error } = await supabase
      .from("castlinker_posts")
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data as Post;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

export const applyToPost = async (post_id: string, user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("post_applications")
      .insert({ post_id, user_id })
      .select()
      .single();

    if (error) throw error;
    return data as PostApplication;
  } catch (error) {
    console.error("Error applying to post:", error);
    return null;
  }
};

export const checkIfApplied = async (post_id: string, user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("post_applications")
      .select("*")
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking application:", error);
    return false;
  }
};

export const getApplicationsForPost = async (post_id: string) => {
  try {
    const { data, error } = await supabase
      .from("post_applications")
      .select("*")
      .eq("post_id", post_id);

    if (error) throw error;
    return data as PostApplication[];
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const togglePostLike = async (post_id: string, user_id: string) => {
  try {
    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    if (checkError) throw checkError;

    if (existingLike && existingLike.length > 0) {
      // Unlike the post
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post_id)
        .eq("user_id", user_id);

      if (deleteError) throw deleteError;
      return false; // Not liked anymore
    } else {
      // Like the post
      const { error: insertError } = await supabase
        .from("post_likes")
        .insert({ post_id, user_id });

      if (insertError) throw insertError;
      return true; // Now liked
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return null;
  }
};

export const checkIfLiked = async (post_id: string, user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking like:", error);
    return false;
  }
};
