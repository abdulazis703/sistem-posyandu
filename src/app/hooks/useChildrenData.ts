"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { mockChildren, Child } from "@/lib/mockData";
import { supabase } from "@/lib/supabase/client";

export const CHILDREN_STORAGE_KEY = "tumbuhku_children_data";
export const CHILDREN_SYNC_EVENT = "tumbuhku_children_updated";

/**
 * Get children synchronously from localStorage (if in browser) or fallback to mockChildren.
 */
export function getStoredChildren(): Child[] {
  if (typeof window === "undefined") {
    return mockChildren;
  }
  try {
    const raw = localStorage.getItem(CHILDREN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Gagal membaca data balita dari localStorage:", err);
  }
  return mockChildren;
}

/**
 * Persist children to localStorage, dispatch update event, and optionally sync with Supabase.
 */
function cacheChildren(data: Child[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CHILDREN_SYNC_EVENT, { detail: data }));
  } catch (err) {
    console.error("Gagal menyimpan ke localStorage:", err);
  }
}

async function fetchRemoteChildren(): Promise<Child[] | null> {
  const { data, error } = await supabase.from("app_children").select("payload").order("id");
  if (error) {
    console.error("Gagal membaca Supabase:", error.message);
    return null;
  }
  return data.map((r) => r.payload as Child);
}

// Mode ganti-total: isi tabel dibuat sama persis dengan data terbaru
async function pushRemoteChildren(data: Child[]) {
  const del = await supabase.from("app_children").delete().neq("id", "");
  if (del.error) {
    console.error("Gagal menghapus data lama:", del.error.message);
    return;
  }
  const rows = data.map((c) => ({ id: c.id, nik: c.nik, payload: c }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase.from("app_children").insert(rows.slice(i, i + 500));
    if (error) {
      console.error("Gagal sync ke Supabase:", error.message);
      return;
    }
  }
}

export function persistChildren(data: Child[]) {
  cacheChildren(data);
  void pushRemoteChildren(data);
}

/**
 * Clear persisted children and restore mock data.
 */
export function clearStoredChildren() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHILDREN_STORAGE_KEY);
  void supabase.from("app_children").delete().neq("id", "");
  window.dispatchEvent(new CustomEvent(CHILDREN_SYNC_EVENT, { detail: mockChildren }));
}

/**
 * Custom hook to subscribe to and manage synchronized children data.
 */
export default function useChildrenData() {
  const [children, setChildrenState] = useState<Child[]>(mockChildren); // sama di server dan client
  const childrenRef = useRef<Child[]>(mockChildren);

  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  useEffect(() => {
    let cancelled = false;

    setChildrenState(getStoredChildren()); // cache lokal dulu (cepat)
    fetchRemoteChildren().then((remote) => {
      if (!cancelled && remote && remote.length > 0) cacheChildren(remote); // lalu data dari Supabase
    });

    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent<Child[]>).detail;
      setChildrenState(Array.isArray(detail) ? detail : getStoredChildren());
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CHILDREN_STORAGE_KEY) setChildrenState(getStoredChildren());
    };

    window.addEventListener(CHILDREN_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleStorage);
    return () => {
      cancelled = true;
      window.removeEventListener(CHILDREN_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setChildren = useCallback(
    (newData: Child[] | ((prev: Child[]) => Child[])) => {
      const next = typeof newData === "function" ? newData(childrenRef.current) : newData;
      persistChildren(next); // memicu event, handleSync yang memperbarui state
    },
    []
  );

  const resetChildren = useCallback(() => {
    clearStoredChildren();
  }, []);

  return {
    children,
    setChildren,
    resetChildren,
    hasCustomData: children.length !== mockChildren.length || children[0]?.id !== mockChildren[0]?.id,
  };
}
