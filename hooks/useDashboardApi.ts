'use client';

import { useState, useEffect } from "react";
import api from "@/lib/api"; // ← your axios instance with cookies & refresh interceptor
import { ACCESS_TOKEN } from "@/constants";
import Cookies from "js-cookie";

// ============================
// BACKEND TYPES (REAL)
// ============================

export interface CsReport {
  id: number;
  report_id: string;
  report_type: "damage" | "assistance" | "srhr" | 'gbv';
  srhr_type: "maternal_health" | "contraceptive" | "hiv" | "gbv_support" | "other" | null;
  gbv_type: "physical_violence" | "sexual_violence" | "emotional_abuse" | "economic_violence" | "fgm" | "child_marriage" | "other" | null;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: "Pending" | "Responding" | "Resolved";
  source_platform: "web" | "ussd" | "whatsapp" | "messenger" | string;
  created_at: string;
}

interface DashboardStats {
  total_reports: number;
  pending: number;
  resolved: number;
  responders_online: number;
}

type ReportStat = {
  report_type: string;
  total: number;
};

type DashStats = ReportStat[];

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================
// GENERIC API CALL (using Axios + cookies)
// ============================

async function apiGet<T>(url: string): Promise<T> {
  try {
    const token = Cookies.get(ACCESS_TOKEN); // JWT-access cookie

    const response = await api.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });

    return response.data;
  } catch (err: any) {
    console.error(`API GET ${url} failed:`, err);
    throw err.response?.data || err.message || "Request failed";
  }
}

// ============================
// 1. DASHBOARD STATS
// ============================

export const useDashboardStats = (): ApiResponse<ReportStat[]> => {
  const [data, setData] = useState<ReportStat[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const stats = await apiGet<ReportStat[]>("/reports/stats/");
        setData(stats);
      } catch (err: any) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
};

// ============================
// 2. ALL REPORTS (REAL csReport STRUCTURE)
// ============================

export const useReports = (): ApiResponse<CsReport[]> => {
  const [data, setData] = useState<CsReport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const reports = await apiGet<CsReport[]>("/reports/list/");
        setData(reports);
      } catch (err: any) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
};

// ============================
// 3. MAP DATA (NO MOCK — USE REAL REPORTS)
// ============================
// NOTE: if your backend exposes /reports/map/ use that.
// Otherwise we reuse /reports/ and filter to only those with coordinates.

export const useMapData = (): ApiResponse<CsReport[]> => {
  const [data, setData] = useState<CsReport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // If backend has /reports/map/ endpoint, switch this line:
        // const mapData = await apiGet<CsReport[]>("/reports/map/");

        const reports = await apiGet<CsReport[]>("/reports/list/");
        const withCoords = reports.filter(
          (r) => r.latitude !== null && r.longitude !== null
        );

        setData(withCoords);
      } catch (err: any) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
};

// ============================
// 4. ANALYTICS (REAL ENDPOINT VERSION)
// ============================

export const useAnalytics = (): ApiResponse<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const analytics = await apiGet<any>("/reports/analytics/");
        setData(analytics);
      } catch (err: any) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
};

// ============================
// 5. PROFILE (REAL VERSION)
// ============================

export const useProfile = (): ApiResponse<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const profile = await apiGet<any>("/auth/profile/");
        setData(profile);
      } catch (err: any) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
};
