"use client";
import Link from "next/link";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <Suspense>
      <div className="flex min-h-[90vh] flex-col items-center justify-center text-9xl font-bold">
        <p>404</p>
        <Link href={"/"} className="text-xl underline" scroll={false}>
          home
        </Link>
      </div>
    </Suspense>
  );
}
