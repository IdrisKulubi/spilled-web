"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, CheckCircle, Clock, AlertCircle, Camera, FileImage, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VerifyPage() {
  const [status, setStatus] = useState<"unknown" | "pending" | "approved" | "unverified">("unknown");
  const [file, setFile] = useState<File | null>(null);
  const [idType, setIdType] = useState<"school_id" | "national_id">("school_id");
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(
        `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of 5MB. Please compress or resize your image.`,
        {
          duration: 5000,
        }
      );
      return;
    }

    // File is valid, proceed
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.success(`Image selected: ${file.name}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    // Double-check file size before upload
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds 5MB. Please select a smaller image.");
      return;
    }

    setBusy(true);
    try {
      toast.info("Uploading your ID...");
      
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
      
      toast.success("ID uploaded successfully! We'll review it shortly.");
      setStatus("pending");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to upload ID. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (status === "approved") {
    return (
      <div className="min-h-screen bg-[#FDECEF] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Verification Complete!</h1>
              <p className="text-gray-600">
                You're verified! You can now post stories, comment, and explore freely.
              </p>
              <div className="pt-4">
                <Button asChild className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white">
                  <Link href="/home">Go to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-[#FDECEF] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-4">
             
              <h1 className="text-2xl font-bold text-gray-800">Verification Pending</h1>
              <p className="text-gray-600">
                We're reviewing your ID. This takes less than 15 minutes.
              </p>
              <div className="pt-4">
                <Button variant="outline" asChild className="w-full h-12 border-gray-300">
                  <Link href="/home">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDECEF] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/spilled-icon.png" 
              alt="Spilled Logo" 
              width={60} 
              height={60}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Identity</h1>
          <p className="text-gray-600">
            To keep Spilled safe for women, please upload a photo of your ID
          </p>
        </div>

        <Card className="bg-white border-0 shadow-xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* ID Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Select ID Type</Label>
              <RadioGroup 
                value={idType} 
                onValueChange={(value) => setIdType(value as any)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <label 
                  htmlFor="school_id" 
                  className={cn(
                    "relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all",
                    idType === "school_id" 
                      ? "border-pink-500 bg-pink-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <RadioGroupItem value="school_id" id="school_id" className="sr-only" />
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">School ID</div>
                    <div className="text-xs text-gray-500 mt-1">Student or staff ID</div>
                  </div>
                </label>
                
                <label 
                  htmlFor="national_id" 
                  className={cn(
                    "relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all",
                    idType === "national_id" 
                      ? "border-pink-500 bg-pink-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <RadioGroupItem value="national_id" id="national_id" className="sr-only" />
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">National ID</div>
                    <div className="text-xs text-gray-500 mt-1">Government issued ID</div>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* File Upload Area */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Upload ID Photo</Label>
              
              <div
                className={cn(
                  "relative rounded-lg border-2 border-dashed transition-all",
                  dragActive 
                    ? "border-pink-500 bg-pink-50" 
                    : "border-gray-300 hover:border-gray-400",
                  previewUrl && "border-solid"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={busy}
                />
                
                <label
                  htmlFor="file-upload"
                  className={cn(
                    "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg p-6",
                    previewUrl && "min-h-[300px]"
                  )}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewUrl} 
                        alt="ID Preview" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Click to change</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                        <Upload className="h-8 w-8 text-pink-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Drop your ID here, or click to browse
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {file && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <FileImage className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Important Notice */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Important</p>
                  <p className="text-xs text-blue-700">
                    Your ID will be securely stored and only used for verification purposes. 
                    We take your privacy seriously.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={onUpload} 
              disabled={busy || !file}
              className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50"
            >
              {busy ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Uploading...</span>
                </div>
              ) : (
                "Submit for Verification"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Having trouble? <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
