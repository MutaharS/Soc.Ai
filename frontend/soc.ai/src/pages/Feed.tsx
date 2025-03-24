import { useState, useEffect } from "react";
import { postsApi, Post } from "../api";

const DEFAULT_PROFILE_PICTURE =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsApi.getAllPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch posts");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="card">Loading posts...</div>;
  }

  if (error) {
    return <div className="card">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="hero-title">Feed</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {posts.map((post) => (
          <div key={post._id} className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <img
                src={post.userId?.profilePicture || DEFAULT_PROFILE_PICTURE}
                alt={post.userId?.username || "Anonymous"}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {post.userId?.username || "Anonymous"}
                </div>
                <div
                  style={{
                    color: "var(--color-gray-500)",
                    fontSize: "0.875rem",
                  }}
                >
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
