"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { repoAddPost } from "@/lib/actions/domain";
import { presignUpload } from "@/lib/actions/upload";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function AddPostPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [guyName, setGuyName] = useState("");
  const [guyPhone, setGuyPhone] = useState("");
  const [guySocials, setGuySocials] = useState("");
  const [guyLocation, setGuyLocation] = useState("");
  const [guyAge, setGuyAge] = useState<string>("");

  const [storyText, setStoryText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(true);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    setIsUploading(true);
    try {
      // Get presigned upload URL
      const { uploadUrl, publicUrl } = await presignUpload({
        folder: 'stories',
        filename: selectedImage.name,
        contentType: selectedImage.type
      });

      // Upload to R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedImage,
        headers: {
          'Content-Type': selectedImage.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      setUploadedImageUrl(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = () => {
    setError(null);
    setSuccess(null);
    if (!storyText.trim()) {
      setError("Story text is required");
      return;
    }
    if (tags.length === 0) {
      setError("Select at least one tag");
      return;
    }
    if (!guyName && !guyPhone && !guySocials) {
      setError("Provide a name, phone, or social");
      return;
    }
    // Photo is required
    if (!selectedImage && !uploadedImageUrl) {
      setError("Please select a photo to support your story");
      return;
    }
    // If image is selected but not uploaded, require upload first
    if (selectedImage && !uploadedImageUrl) {
      setError("Please upload the selected image first");
      return;
    }

    startTransition(async () => {
      try {
        // If there's an image selected but not uploaded, upload it first
        let finalImageUrl = uploadedImageUrl;
        if (selectedImage && !uploadedImageUrl) {
          finalImageUrl = await uploadImage();
          if (!finalImageUrl) {
            setError("Failed to upload image. Please try again.");
            return;
          }
        }

        const res = await repoAddPost({
          guyName: guyName || undefined,
          guyPhone: guyPhone || undefined,
          guySocials: guySocials || undefined,
          guyLocation: guyLocation || undefined,
          guyAge: guyAge ? Number(guyAge) : undefined,
          storyText: storyText,
          tags: tags as any,
          imageUrl: finalImageUrl,
          anonymous,
          nickname: anonymous ? undefined : nickname || undefined,
        });
        if ((res as any)?.success) {
          setSuccess("Posted! 🎉 Redirecting...");
          setTimeout(() => router.push("/home"), 800);
        } else {
          setError("Failed to post");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to post");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Share Your Story</h1>
        <p className="text-sm text-muted-foreground">Help other women by sharing your experience. All information is kept secure.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Name or Nickname</label>
            <Input value={guyName} onChange={(e) => setGuyName(e.target.value)} placeholder="John Doe / Johnny" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input value={guyPhone} onChange={(e) => setGuyPhone(e.target.value)} placeholder="+254 ..." />
            </div>
            <div>
              <label className="text-sm font-medium">Socials</label>
              <Input value={guySocials} onChange={(e) => setGuySocials(e.target.value)} placeholder="@handle" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input value={guyLocation} onChange={(e) => setGuyLocation(e.target.value)} placeholder="Nairobi, Karen, ..." />
            </div>
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input value={guyAge} onChange={(e) => setGuyAge(e.target.value)} placeholder="25" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <label className="text-sm font-medium">Your Story *</label>
          <Textarea value={storyText} onChange={(e) => setStoryText(e.target.value)} rows={6} placeholder="Share your story here..." />
          <div className="text-xs text-muted-foreground">{storyText.length} characters</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <label className="text-sm font-medium">Add Photo *</label>
          <div className="text-xs text-muted-foreground mb-3">Share a relevant photo to support your story. JPG, PNG up to 5MB.</div>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </div>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {selectedImage && !uploadedImageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={uploadImage}
                    disabled={isUploading}
                    className="text-xs"
                  >
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              )}
              {uploadedImageUrl && (
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  ✓ Image uploaded successfully
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <label className="text-sm font-medium">How would you tag this?</label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "red_flag", label: "Red Flag 🚩" },
              { key: "good_vibes", label: "Good Vibes ✨" },
              { key: "unsure", label: "Unsure ❓" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => toggleTag(t.key)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  tags.includes(t.key) ? "bg-accent border-primary text-primary" : "bg-background"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tags.length > 0 && (
            <div className="text-xs text-muted-foreground">Selected: {tags.join(", ")}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Post Anonymously</div>
              <div className="text-xs text-muted-foreground">Your identity will be completely hidden</div>
            </div>
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          </div>
          {!anonymous && (
            <div>
              <label className="text-sm font-medium">Display Nickname *</label>
              <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Sarah K., Anonymous User, ..." />
            </div>
          )}
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div>
        <Button onClick={onSubmit} disabled={isPending || !storyText.trim()}>
          {isPending ? "Posting..." : anonymous ? "Post Anonymously" : `Post as ${nickname || "Nickname"}`}
        </Button>
      </div>
    </div>
  );
}

