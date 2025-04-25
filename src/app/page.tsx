"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
import { Separator } from "@/components/ui/separator";
import UserButton from "@/components/user-button";
import AddButton from "@/components/add-button";

const Home = () => {
  const [posts, setPosts] = useState<
    {
      _id: string;
      title: string;
      content: string;
      createdAt: string;
      userEmail: string;
    }[]
  >([]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) {
        toast.error("Failed to fetch posts.");
        return;
      }

      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      toast.error("An error occurred while fetching posts.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPosts(posts.filter((post) => post._id !== id));
      toast.success("Post deleted successfully.");
    } else {
      toast.error("Failed to delete post.");
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredPosts = selectedDate
    ? sortedPosts.filter((post) => {
        const postDate = new Date(post.createdAt).toISOString().split("T")[0];
        return postDate === selectedDate;
      })
    : sortedPosts;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <UserButton />
        <AddButton />
      </div>
      <div className="mb-4">
        <label htmlFor="date-filter" className="mr-2">
          Filter by Date:
        </label>
        <input
          type="date"
          id="date-filter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="sort-order" className="mr-2">
          Sort by Time:
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-center text-muted-foreground">No posts found.</p>
      ) : (
        filteredPosts.map((post) => (
          <Card key={post._id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                Posted on {new Date(post.createdAt).toLocaleDateString()} at{" "}
                {new Date(post.createdAt).toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
              <p>
                {post.content.length > 30
                  ? `${post.content.substring(0, 30)}...`
                  : post.content}
              </p>
              <div className="flex gap-4">
                {session?.user?.email === post.userEmail && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/edit-post/${post._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
                <Button onClick={() => router.push(`/blogpost/${post._id}`)}>
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Home;
