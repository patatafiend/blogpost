"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const CreatePostPage = () => {
  const { data: session } = useSession(); // Get the current user's session
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      if (image) {
        formData.append("image", image);
      }

      // Include the user's email or ID in the form data
      if (session?.user?.email) {
        formData.append("userEmail", session.user.email);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Post created successfully!");
        router.push("/"); // Redirect to homepage
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create post.");
        toast.error(data.message || "Failed to create post.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center">Create Post</CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            Share your thoughts with the world.
          </CardDescription>
        </CardHeader>
        <Separator />
        {!!error && (
          <div className="text-red-500 text-sm flex items-center justify-center mb-4 space-x-2">
            <p>{error}</p>
          </div>
        )}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              disabled={pending}
              placeholder="Post Title"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
              }}
              required
            />
            <Textarea
              disabled={pending}
              placeholder="Post Content"
              value={form.content}
              onChange={(e) => {
                setForm({ ...form, content: e.target.value });
              }}
              rows={6}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Image (optional)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={pending}
              />
            </div>
            <Button className="w-full" size="lg" disabled={pending}>
              {pending ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostPage;
