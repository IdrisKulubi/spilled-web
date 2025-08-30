"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyPage() {
  const [status, setStatus] = useState<"unknown" | "pending" | "approved" | "unverified">("unknown");
  const [file, setFile] = useState<File | null>(null);
  const [idType, setIdType] = useState<"school_id" | "national_id">("school_id");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/verification/upload", { method: "GET" });
        const data = await res.json();
        if (!mounted) return;
        if (data?.success) {
          if (data.status === "approved") setStatus("approved");
          else if (data.status === "pending" && data.idImageUrl) setStatus("pending");
          else setStatus("unverified");
        } else {
          setStatus("unverified");
        }
      } catch {
        setStatus("unverified");
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onUpload = async () => {
    if (!file) return;
    setBusy(true);
    try {
      // 1) Presign
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, idType }),
      });
      const presign = await presignRes.json();
      if (!presign?.success) throw new Error(presign?.error || "Failed to presign");
      // 2) Upload to R2
      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");
      // 3) Tell backend
      const updRes = await fetch("/api/verification/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicUrl: presign.publicUrl, idType }),
      });
      const upd = await updRes.json();
      if (!upd?.success) throw new Error(upd?.error || "Failed to save");
      setStatus("pending");
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  if (status === "approved") {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-3">
            <div className="text-5xl">✅</div>
            <div className="text-lg font-semibold">Verification Complete!</div>
            <p className="text-sm text-muted-foreground">You're verified. You can post stories, comment, and explore freely.</p>
            <div className="pt-2">
              <Button asChild>
                <Link href="/home">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-5xl">⏳</div>
            <div className="text-lg font-semibold">Verification Pending</div>
            <p className="text-sm text-muted-foreground">We're reviewing your ID. You'll be notified once it's approved.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-5xl">🆔</div>
            <div className="text-lg font-semibold">Verify Your Identity</div>
            <p className="text-sm text-muted-foreground max-w-prose mx-auto">
              To keep Spilled safe for women, please upload a photo of your ID.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">ID Type:</label>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={idType}
              onChange={(e) => setIdType(e.target.value as any)}
            >
              <option value="school_id">School ID</option>
              <option value="national_id">National ID</option>
            </select>
          </div>
          <div className="space-y-2">
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button onClick={onUpload} disabled={busy || !file}>{busy ? "Uploading..." : "Upload & Submit"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

