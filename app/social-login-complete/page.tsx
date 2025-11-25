"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export default function SocialLoginComplete() {
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
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Completing login...</p>
    </div>
  );
}
