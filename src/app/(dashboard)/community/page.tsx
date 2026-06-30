"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import { postCategories, type Community, type CommunityPost } from "@/lib/mock-data";

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>("すべて");
  const [postText, setPostText] = useState("");
  const [postCategory, setPostCategory] = useState(postCategories[0]);
  const [postCommunityId, setPostCommunityId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    fetch("/api/community")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json() as Promise<{ communities: Community[]; posts: CommunityPost[] }>;
      })
      .then((data) => {
        if (!active) return;
        setCommunities(data.communities);
        setPosts(data.posts);
        setPostCommunityId((prev) => prev || data.communities.find((c) => c.joined)?.id || data.communities[0]?.id || "");
      })
      .catch(() => {
        if (active) setError("データの取得に失敗しました。再読み込みしてください。");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function toggleJoin(id: string) {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c
      )
    );
    try {
      const res = await fetch(`/api/community/communities/${id}/join`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { communities: Community[] };
      setCommunities(data.communities);
    } catch {
      setError("コミュニティの参加状況の更新に失敗しました。");
    }
  }

  async function toggleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { post: CommunityPost };
      setPosts((prev) => prev.map((p) => (p.id === postId ? data.post : p)));
    } catch {
      setError("いいねの更新に失敗しました。");
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  async function submitPost() {
    if (!postText.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const communityName =
        communities.find((c) => c.id === postCommunityId)?.name ?? communities[0]?.name ?? "";
      const formData = new FormData();
      formData.append("community", communityName);
      formData.append("category", postCategory);
      formData.append("text", postText);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/community/posts", { method: "POST", body: formData });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { post: CommunityPost };
      setPosts((prev) => [data.post, ...prev]);
      setPostText("");
      clearImage();
    } catch {
      setError("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  async function addComment(postId: string) {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { post: CommunityPost };
      setPosts((prev) => prev.map((p) => (p.id === postId ? data.post : p)));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      setError("コメントの投稿に失敗しました。");
    }
  }

  const filteredPosts =
    categoryFilter === "すべて" ? posts : posts.filter((p) => p.category === categoryFilter);

  if (loading) {
    return (
      <div className="flex flex-col">
        <TopBar title="コミュニティ" subtitle="興味でつながる仲間を見つけよう" category="community" />
        <div className="p-8 text-center text-sm text-love-navy/40">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <TopBar title="コミュニティ" subtitle="興味でつながる仲間を見つけよう" category="community" />

      <div className="space-y-6 p-4 sm:p-8">
        {error && (
          <div className="rounded-2xl border border-love-pink/30 bg-love-pink-soft px-4 py-3 text-sm text-love-pink-dark">
            {error}
          </div>
        )}

        {/* コミュニティ一覧 */}
        <section>
          <p className="text-xs font-medium text-love-navy/50">コミュニティ一覧</p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {communities.map((c) => (
              <div key={c.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-love-pink-soft px-2.5 py-1 text-[11px] font-semibold text-love-pink-dark">
                      {c.category}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-love-navy">{c.name}</h3>
                  </div>
                  <button
                    onClick={() => toggleJoin(c.id)}
                    className={`flex-none rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                      c.joined
                        ? "bg-love-gold-soft text-love-navy hover:bg-love-bg"
                        : "bg-love-pink text-white hover:bg-love-pink-dark"
                    }`}
                  >
                    {c.joined ? "参加済み" : "参加する"}
                  </button>
                </div>
                <p className="mt-2 text-sm text-love-navy/60">{c.description}</p>
                <p className="mt-3 text-xs text-love-navy/40">👥 {c.members.toLocaleString()}人が参加</p>
              </div>
            ))}
          </div>
        </section>

        {/* 新しい投稿 */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-love-navy/50">新しい投稿</p>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="コミュニティに共有したいことを書いてみましょう"
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-black/10 bg-love-bg px-4 py-3 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-love-bg px-3 text-xs font-medium text-love-navy/60 transition-colors hover:bg-love-pink-soft">
              📷 画像を選択
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image src={imagePreview} alt="" fill unoptimized className="object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white"
                  aria-label="画像を削除"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={postCommunityId}
                onChange={(e) => setPostCommunityId(e.target.value)}
                className="rounded-full border border-black/10 bg-love-bg px-3 py-1 text-xs font-semibold text-love-navy/70 outline-none focus:border-love-pink"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {postCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPostCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    postCategory === c
                      ? "bg-love-pink text-white"
                      : "bg-love-bg text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={submitPost}
              disabled={!postText.trim() || submitting}
              className="rounded-full bg-love-pink px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </section>

        {/* カテゴリーフィルター */}
        <section className="flex flex-wrap gap-2">
          {["すべて", ...postCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === c
                  ? "bg-love-pink text-white"
                  : "border border-black/5 bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
              }`}
            >
              {c}
            </button>
          ))}
        </section>

        {/* 投稿一覧 */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium text-love-navy/50">投稿一覧</p>
          {filteredPosts.length === 0 ? (
            <p className="mt-3 text-sm text-love-navy/40">このカテゴリーの投稿はまだありません</p>
          ) : (
            <ul className="mt-3 space-y-5">
              {filteredPosts.map((post) => (
                <li key={post.id} className="border-b border-black/5 pb-5 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-love-pink-soft text-sm font-bold text-love-pink-dark">
                      {post.avatarInitial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-love-navy/40">
                        <span className="font-semibold text-love-navy">{post.author}</span>
                        <span>・{post.community}</span>
                        <span>・{post.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-love-navy">{post.text}</p>

                      {post.image && (
                        post.image.startsWith("/") ? (
                          <div className="relative mt-2 h-56 w-full max-w-sm overflow-hidden rounded-xl">
                            <Image src={post.image} alt="" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="mt-2 flex h-32 w-32 items-center justify-center rounded-xl bg-love-pink-soft text-5xl">
                            {post.image}
                          </div>
                        )
                      )}

                      <span className="mt-2 inline-block rounded-full bg-love-gold-soft px-2.5 py-1 text-[11px] font-semibold text-love-navy">
                        {post.category}
                      </span>

                      {/* いいね・コメント */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-love-navy/50">
                        <button
                          type="button"
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1 font-semibold transition-colors ${
                            post.liked ? "text-love-pink-dark" : "hover:text-love-pink-dark"
                          }`}
                        >
                          <span>{post.liked ? "❤️" : "🤍"}</span>
                          {post.likes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenCommentsId((prev) => (prev === post.id ? null : post.id))}
                          className="flex items-center gap-1 font-semibold transition-colors hover:text-love-pink-dark"
                        >
                          💬 {post.comments.length}
                        </button>
                      </div>

                      {/* コメント */}
                      {openCommentsId === post.id && (
                        <div className="mt-3 space-y-2 rounded-xl bg-love-bg p-3">
                          {post.comments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2 text-xs">
                              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-love-pink-soft text-[10px] font-bold text-love-pink-dark">
                                {c.avatarInitial}
                              </span>
                              <p className="text-love-navy">
                                <span className="font-semibold">{c.author}</span> {c.text}
                              </p>
                            </div>
                          ))}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              addComment(post.id);
                            }}
                            className="flex items-center gap-2 pt-1"
                          >
                            <input
                              value={commentInputs[post.id] ?? ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              placeholder="コメントを入力..."
                              className="flex-1 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
                            />
                            <button
                              type="submit"
                              className="rounded-full bg-love-pink px-3 py-1.5 text-xs font-bold text-white hover:bg-love-pink-dark"
                            >
                              送信
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[11px] text-love-navy/30">
            ※ データはサーバー上に保存され、再読み込み後も保持されます。投票・ランキング機能はPhase4で本格実装予定です。
          </p>
        </section>
      </div>
    </div>
  );
}
