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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      {
        setPending(false);

        const data = await res.json();
        toast.success(data.message);
        router.push("/sign-in");
      }
    } else if (res.status === 400) {
      const data = await res.json();
      setError(data.message);
      toast.error(data.message);
      setPending(false);
    } else if (res.status === 500) {
      const data = await res.json();
      setError(data.message);
      toast.error(data.message);
      setPending(false);
    }
  };
  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <Separator />
        {!!error && (
          <div className="text-red-500 text-sm flex items-center justify-center mb-4 space-x-2">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              disabled={pending}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
              }}
              required
            />
            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
              }}
              required
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
              }}
              required
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => {
                setForm({ ...form, confirmPassword: e.target.value });
              }}
              required
            />
            <Button className="w-full" size="lg" disabled={pending}>
              Sign Up
            </Button>
          </form>

          <Separator className="my-4" />
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
