"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import Image from "next/image";

const EditPostPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [post, setPost] = useState({ title: "", content: "", image: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No post ID provided.");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error("Post not found");
        }
        const data = await res.json();
        setPost({
          title: data.post.title,
          content: data.post.content,
          image: data.post.image,
        });
        console.log("Post data fetched:", post, id);
      } catch (err) {
        console.error(err);
        setError("Failed to load post data.");
      }
    };

    fetchPost();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Post updated successfully!");
        router.push("/");
      } else {
        setError(data.message || "Failed to update post.");
        toast.error(data.message || "Failed to update post.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Error updating post:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <Card className="w-[90%] max-w-2xl p-4 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center">Edit Post</CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            Update your post details below.
          </CardDescription>
        </CardHeader>
        <Separator />
        {!!error && (
          <div className="text-red-500 text-sm flex justify-center mb-4">
            {error}
          </div>
        )}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="title"
              placeholder="Post Title"
              value={post.title}
              onChange={handleInputChange}
              disabled={pending}
              required
            />
            <Textarea
              name="content"
              placeholder="Post Content"
              value={post.content}
              onChange={handleInputChange}
              rows={6}
              disabled={pending}
              required
            />
            <Image
              src={post.image}
              alt="Post Image"
              width={200}
              height={200}
              className="rounded-md mb-4"
            />

            <Input
              type="file"
              name="image"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPost((prev) => ({ ...prev, image: file.name }));
                }
              }}
              disabled={pending}
            />
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Updating..." : "Update Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPostPage;
