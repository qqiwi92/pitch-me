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
import { login, verifyOtp } from "./actions";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast/use-toast";
import { Suspense, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageSuspense />
    </Suspense>
  );
}
function LoginPageSuspense() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("t");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (errorType === "invalid_credentials") {
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password and try again.",
        variant: "destructive",
      });
      router.replace("/login");
    } else if (errorType === "sent_magic_link") {
      toast({
        title: "Magic link sent",
        description: "Check your email for the magic link.",
        variant: "success",
      });
      router.replace("/login");
    } else if (errorType === "otp_expired") {
      toast({
        title: "Code is wrong",
        description: "Please check your email and try again.",
        variant: "destructive",
      });
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorType]);
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {sent ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Magic link sent
            </CardTitle>
            <CardDescription>
              Check your email for the code. We have sent it to{" "}
              <span className="font-semibold">{email} </span>
            </CardDescription>
          </CardHeader>
          <div className="flex justify-center p-3">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e);
                if (e.length === 6) {
                  const formData = new FormData();
                  formData.append("otp", e);
                  formData.append("email", email);
                  verifyOtp(formData);
                }
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </Card>
      ) : (
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
              <Input
                id="email"
                name="email"
                placeholder="somemail@mail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="mt-3 flex gap-3">
                <span className="group relative transition hover:scale-95">
                  <Button variant={"shine"} className="">
                    Log in
                  </Button>
                  <button
                    className="absolute inset-0"
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append("email", email);
                      setSent(true);
                      login(formData);
                    }}
                  ></button>
                </span>
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
