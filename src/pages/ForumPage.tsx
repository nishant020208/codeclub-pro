import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MessageSquare, ThumbsUp, Send, ChevronLeft, Plus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: string;
  upvotes: number;
  created_at: string;
}

interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  upvotes: number;
  created_at: string;
}

const CATEGORIES = ["general", "dsa", "webdev", "career", "bugs", "showcase"];

const ForumPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [profiles, setProfiles] = useState<Map<string, string>>(new Map());
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [myUpvotes, setMyUpvotes] = useState<Set<string>>(new Set());

  const fetchPosts = async () => {
    const { data } = await supabase.from("forum_posts").select("*").order("created_at", { ascending: false });
    setPosts((data as any) || []);
    const userIds = new Set<string>();
    (data || []).forEach((p: any) => userIds.add(p.user_id));
    if (userIds.size > 0) {
      const { data: profs } = await supabase.from("profiles").select("user_id, user_code").in("user_id", Array.from(userIds));
      const map = new Map<string, string>();
      (profs || []).forEach((p: any) => map.set(p.user_id, p.user_code));
      setProfiles(map);
    }
    if (user) {
      const { data: ups } = await supabase.from("forum_upvotes").select("post_id").eq("user_id", user.id);
      setMyUpvotes(new Set((ups || []).map((u: any) => u.post_id).filter(Boolean)));
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [user]);

  const fetchReplies = async (postId: string) => {
    const { data } = await supabase.from("forum_replies").select("*").eq("post_id", postId).order("created_at");
    setReplies((data as any) || []);
    const userIds = new Set<string>();
    (data || []).forEach((r: any) => userIds.add(r.user_id));
    if (userIds.size > 0) {
      const { data: profs } = await supabase.from("profiles").select("user_id, user_code").in("user_id", Array.from(userIds));
      const newMap = new Map(profiles);
      (profs || []).forEach((p: any) => newMap.set(p.user_id, p.user_code));
      setProfiles(newMap);
    }
  };

  const openPost = (post: ForumPost) => {
    setSelectedPost(post);
    fetchReplies(post.id);
  };

  const createPost = async () => {
    if (!user || !newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("forum_posts").insert({
      title: newTitle, content: newContent, user_id: user.id, category: newCategory,
    });
    if (error) toast.error(error.message);
    else { toast.success("Post created!"); setShowNew(false); setNewTitle(""); setNewContent(""); fetchPosts(); }
    setSubmitting(false);
  };

  const addReply = async () => {
    if (!user || !selectedPost || !replyText.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("forum_replies").insert({
      post_id: selectedPost.id, user_id: user.id, content: replyText,
    });
    if (error) toast.error(error.message);
    else { setReplyText(""); fetchReplies(selectedPost.id); }
    setSubmitting(false);
  };

  const toggleUpvote = async (postId: string) => {
    if (!user) return;
    if (myUpvotes.has(postId)) {
      await supabase.from("forum_upvotes").delete().eq("user_id", user.id).eq("post_id", postId);
      setMyUpvotes(prev => { const n = new Set(prev); n.delete(postId); return n; });
    } else {
      await supabase.from("forum_upvotes").insert({ user_id: user.id, post_id: postId });
      setMyUpvotes(prev => new Set(prev).add(postId));
    }
    fetchPosts();
  };

  const filtered = filter === "all" ? posts : posts.filter(p => p.category === filter);

  if (selectedPost) {
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Forum
        </button>
        <div className="terminal-card rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono">{selectedPost.category}</span>
              <h2 className="text-xl font-bold text-foreground mt-2">{selectedPost.title}</h2>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {profiles.get(selectedPost.user_id) || "???"} · {formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{selectedPost.content}</p>
        </div>

        {/* Replies */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-mono">// {replies.length} replies</p>
          {replies.map(r => (
            <div key={r.id} className="terminal-card rounded-lg p-4">
              <p className="text-sm text-foreground">{r.content}</p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                {profiles.get(r.user_id) || "???"} · {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..."
            className="flex-1 px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm"
            onKeyDown={e => e.key === "Enter" && addReply()} />
          <button onClick={addReply} disabled={submitting}
            className="px-4 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-mono mb-1">$ forum --list</p>
          <h1 className="text-2xl font-bold text-foreground">
            <span className="text-primary">Discussion</span> Forum
          </h1>
        </div>
        <button onClick={() => setShowNew(true)}
          className="px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 hover:bg-primary/90 glow-border">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* New post form */}
      {showNew && (
        <div className="terminal-card rounded-lg p-5 animate-fade-in space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
            <span className="text-xs text-muted-foreground font-mono">new_post.sh</span>
          </div>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title"
            className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Write your post..."
            rows={4} className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-none" />
          <div className="flex items-center gap-3">
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
              className="px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm font-mono">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={createPost} disabled={submitting}
              className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
              filter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="shimmer h-20 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="terminal-card rounded-lg p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No posts yet. Start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => (
            <div key={p.id} className="terminal-card rounded-lg p-4 flex items-center gap-4 hover:border-primary/20 transition-all cursor-pointer"
              onClick={() => openPost(p)}>
              <button onClick={(e) => { e.stopPropagation(); toggleUpvote(p.id); }}
                className={`flex flex-col items-center gap-1 shrink-0 px-2 py-1 rounded-md transition-colors ${
                  myUpvotes.has(p.id) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                }`}>
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs font-bold">{p.upvotes}</span>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-foreground text-sm">{p.title}</h3>
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono">{p.category}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {profiles.get(p.user_id) || "???"} · {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                </p>
              </div>
              <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumPage;
