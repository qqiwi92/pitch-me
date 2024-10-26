"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Please sign in to your account or create a new one.
          </CardDescription>
        </CardHeader>
        <div className="">
          <form className="flex flex-col gap-2 p-3">
            <label htmlFor="email">Email:</label>
            <Input id="email" name="email" type="email" required />
            <label htmlFor="password">Password:</label>
            <Input id="password" name="password" type="password" required />
            <div className="mt-3 flex gap-3">
              <span className="relative">
                <Button>Log in</Button>{" "}
                <button
                  className="absolute inset-0"
                  formAction={login}
                ></button>
              </span>
              <span className="relative">
                {" "}
                <Button variant={"ghost"}>Sign up</Button>{" "}
                <button
                  className="absolute inset-0"
                  formAction={signup}
                ></button>
              </span>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
