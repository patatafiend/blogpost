"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const PostDetails = () => {
  const { data: session } = useSession();
  const { id } = useParams();

  const [comments, setComments] = useState<
    {
      _id: string;
      text: string;
      userEmail: string;
      createdAt: string;
    }[]
  >([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [commentPending, setCommentPending] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${id}/comments`);
      const data = await res.json();
      setComments(data.comments);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.length > 300) {
      alert("Comment cannot exceed 300 characters.");
      return;
    }

    setCommentPending(true);

    const res = await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newComment }),
    });

    if (res.ok) {
      const newEntry = await res.json();
      setComments((prev) => [newEntry.comment, ...prev]);
      setNewComment("");
    } else {
      console.error("Failed to post comment.");
    }

    setCommentPending(false);
  };

  const handleDeleteComment = async (id: string) => {
    const confirmed = confirm("Delete this comment?");
    if (!confirmed) return;

    const res = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c._id !== id));
    } else {
      console.error("Failed to delete comment.");
    }
  };

  const handleUpdateComment = async (id: string) => {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: editingCommentText }),
    });

    if (res.ok) {
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, text: editingCommentText } : c))
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } else {
      console.error("Failed to update comment.");
    }
  };

  const [post, setPost] = useState<{
    title: string;
    content: string;
    createdAt: string;
    userEmail: string;
    image: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      const data = await res.json();
      setPost(data.post);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load post.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-10">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center h-full p-10 text-red-500">
        <TriangleAlert className="mr-2" />
        <p>{error || "Post not found."}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex justify-center p-6 bg-gray-100">
      <Card className="w-full max-w-2xl bg-white p-4 sm:p-8 rounded-xl shadow-md">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            Posted by {post.userEmail} on{" "}
            {new Date(post.createdAt).toLocaleDateString()} at{" "}
            {new Date(post.createdAt).toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          {post.image && (
            <Image
              src={post.image}
              alt="Post Image"
              width={200}
              height={200}
              className="rounded-md mb-4"
            />
          )}
            <p className="text-gray-800 whitespace-pre-line">
            {post.content.length > 30
              ? post.content.match(/.{1,40}/g)?.join("\n")
              : post.content}
            </p>
        </CardContent>
        <Separator className="my-6" />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">
              No comments yet. Be the first!
            </p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li
                  key={comment._id}
                  className="border p-3 rounded-md bg-gray-50"
                >
                  {editingCommentId === comment._id ? (
                    <>
                      <textarea
                        className="w-full border rounded p-2 mb-2"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateComment(comment._id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                        <p className="text-sm text-gray-800">
                        {comment.text.length > 30
                          ? comment.text.match(/.{1,40}/g)?.join("\n")
                          : comment.text}
                        </p>
                      <p className="text-xs text-gray-500 mt-1">
                        – {comment.userEmail},{" "}
                        {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                        {new Date(comment.createdAt).toLocaleTimeString()}
                      </p>
                      {session?.user?.email === comment.userEmail && (
                        <div className="flex gap-3 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditingCommentText(comment.text);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          {session ? (
            <form onSubmit={handleCommentSubmit} className="mt-4 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border p-2 rounded-md"
                placeholder="Write a comment..."
                rows={3}
                required
              />
              <Button type="submit" disabled={commentPending}>
                {commentPending ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mt-4">
              Sign in to leave a comment.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PostDetails;
