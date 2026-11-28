"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Child } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getChildrenList } from "@/lib/supabase/dataService";

export const CHILDREN_STORAGE_KEY = "tumbuhku_children_data";
export const CHILDREN_SYNC_EVENT = "tumbuhku_children_updated";

/**
 * Helper kompatibilitas untuk komponen pencarian real-time;
 * mengembalikan cache sesi nyata tanpa fallback data dummy.
 */
export function getStoredChildren(): Child[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = sessionStorage.getItem(CHILDREN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as Child[];
      }
    }
  } catch {
    // ignore parse error
  }
  return [];
}

function cacheChildrenSession(data: Child[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CHILDREN_SYNC_EVENT, { detail: data }));
  } catch {
    // ignore storage quota errors
  }
}

export function clearStoredChildren() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHILDREN_STORAGE_KEY);
  localStorage.removeItem(CHILDREN_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CHILDREN_SYNC_EVENT, { detail: [] }));
}

export interface UseChildrenDataOptions {
  parentId?: string;
  enabled?: boolean;
}

/**
 * Custom hook sumber tunggal untuk mengambil data balita aktual dari Supabase (public.children).
 * Menerapkan Auth-First Query Gating dan isolasi data ketat per parent_id.
 */
export default function useChildrenData(options?: UseChildrenDataOptions) {
  const [children, setChildrenState] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const childrenRef = useRef<Child[]>([]);

  const explicitParentId = options?.parentId;
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  const loadChildren = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    try {
      // Auth-First Query Gating: pastikan identitas user valid sebelum query ke public.children
      if (explicitParentId !== undefined) {
        if (!explicitParentId) {
          setChildrenState([]);
          return;
        }
        const rows = await getChildrenList({ parentId: explicitParentId });
        setChildrenState(rows);
        cacheChildrenSession(rows);
        return;
      }

      const user = await getCurrentUser();
      if (!user?.id) {
        setChildrenState([]);
        return;
      }

      const rows =
        user.role === "parent"
          ? await getChildrenList({ parentId: user.id })
          : await getChildrenList();

      setChildrenState(rows);
      cacheChildrenSession(rows);
    } catch (err) {
      console.error("useChildrenData gagal memuat data balita:", err);
      setChildrenState([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, explicitParentId]);

  useEffect(() => {
    // Bersihkan cache localStorage lama yang berpotensi menyimpan data dummy
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHILDREN_STORAGE_KEY);
    }

    void loadChildren();

    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent<Child[]>).detail;
      if (Array.isArray(detail)) {
        setChildrenState(detail);
      }
    };

    window.addEventListener(CHILDREN_SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener(CHILDREN_SYNC_EVENT, handleSync);
    };
  }, [loadChildren]);

  const setChildren = useCallback(
    (newData: Child[] | ((prev: Child[]) => Child[])) => {
      const next = typeof newData === "function" ? newData(childrenRef.current) : newData;
      setChildrenState(next);
      cacheChildrenSession(next);
    },
    []
  );

  const resetChildren = useCallback(() => {
    clearStoredChildren();
    void loadChildren();
  }, [loadChildren]);

  return {
    children,
    loading,
    refresh: loadChildren,
    setChildren,
    resetChildren,
    hasCustomData: false,
  };
}
