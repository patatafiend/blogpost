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
import { set } from "mongoose";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { TriangleAlert } from "lucide-react";

const SignInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("Sign in successful");
    } else if (res?.status === 400) {
      setError("Invalid Credentials");
      setPending(false);
    } else if (res?.status === 500) {
      setError("Internal Server Error");
      setPending(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            Enter email and password to sign in.
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
              type="email"
              disabled={pending}
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <Button className="w-full">Sign In</Button>
          </form>

          <Separator className="my-4" />
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
