"use server";

import fs             from "fs";
import path           from "path";
import { spawn }      from "child_process";
import { getSession } from "@/actions/auth";

export interface BackupEntry {
  date:          string;
  fileName:      string;
  fileUrl:       string;
  fileSizeBytes: number;
  createdAt:     string;
}

const MANIFEST_PATH = path.join(process.cwd(), "..", "backups", "manifest.json");

export async function getBackupManifest(): Promise<BackupEntry[]> {
  try {
    if (!fs.existsSync(MANIFEST_PATH)) return [];
    const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
    return JSON.parse(raw) as BackupEntry[];
  } catch {
    return [];
  }
}

export async function triggerManualBackup(): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const backupDir    = path.join(process.cwd(), "..", "backup");
  const backupScript = path.join(backupDir, "index.js");

  if (!fs.existsSync(backupScript)) {
    return { success: false, error: "Backup script not found. Ensure the backup/ module is present." };
  }

  return new Promise((resolve) => {
    const child = spawn("node", [backupScript, "--now"], {
      cwd:         backupDir,
      stdio:       "ignore",
      detached:    true,
      windowsHide: true,   // prevents a console window appearing on Windows
      env:         { ...process.env },
    });

    child.unref();

    // Give the process a moment to start; if it errors immediately we catch it
    child.on("error", (err) => {
      resolve({ success: false, error: `Failed to start backup process: ${err.message}` });
    });

    // Resolve after a short delay — the process runs in the background
    setTimeout(() => resolve({ success: true }), 1500);
  });
}
