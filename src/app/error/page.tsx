"use client";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export default function ErrorPage() {
  return (
    <Suspense>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="rounded-md border border-destructive bg-destructive/5 p-3 text-2xl font-bold">
          Sorry, something went wrong
        </p>
        <Button
          variant={"shine"}
          onClick={() => (window.location.href = "/")}
          className="mt-3 font-semibold"
        >
          Go back home
        </Button>
      </div>
    </Suspense>
  );
}
