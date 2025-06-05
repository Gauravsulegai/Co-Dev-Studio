"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Redirects to Google sign-in
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show a loader while checking session
  }

  if (status === "authenticated") {
    return children;
  }

  return null; // Don't render anything while redirecting
}
