"use client";
import { useEffect, Suspense } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

function SocialLoginCompleteContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (!access || !refresh) {
      router.push("/login");
      return;
    }

    Cookies.set(ACCESS_TOKEN, access, { expires: 1, sameSite: "lax" });
    Cookies.set(REFRESH_TOKEN, refresh, { expires: 7, sameSite: "lax" });
    router.push("/dashboard");
  }, [params, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Completing login...</p>
    </div>
  );
}

export default function SocialLoginComplete() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialLoginCompleteContent />
    </Suspense>
  );
}