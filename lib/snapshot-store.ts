// Storage abstraction: Vercel Blob in production, local filesystem in development.
// Set BLOB_READ_WRITE_TOKEN in your environment to enable Vercel Blob.

import fs from "fs/promises";
import path from "path";

const LOCAL_DIR = path.join(process.cwd(), "data", "snapshots");

async function localWrite(key: string, data: object): Promise<void> {
  const filePath = path.join(LOCAL_DIR, key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function localRead(key: string): Promise<any | null> {
  try {
    const content = await fs.readFile(path.join(LOCAL_DIR, key), "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function localList(prefix: string): Promise<string[]> {
  try {
    const dir = path.join(LOCAL_DIR, prefix);
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function storeSnapshot(key: string, data: object): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const result = await put(key, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return result.url;
  }
  await localWrite(key, data);
  return `local://${key}`;
}

export async function readSnapshot(key: string): Promise<any | null> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { list } = await import("@vercel/blob");
    try {
      const { blobs } = await list({ prefix: key, limit: 1 });
      const blob = blobs.find((b) => b.pathname === key);
      if (!blob) return null;
      const res = await fetch(blob.url, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
  return localRead(key);
}

export async function listSnapshotDates(prefix: string): Promise<string[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { list } = await import("@vercel/blob");
    try {
      const { blobs } = await list({ prefix });
      return blobs
        .map((b) => (b.pathname.split("/").pop() ?? "").replace(".json", ""))
        .filter(Boolean)
        .sort()
        .reverse();
    } catch {
      return [];
    }
  }
  return localList(prefix);
}
