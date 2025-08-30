"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { repoAddPost } from "@/lib/actions/domain";
import { useRouter } from "next/navigation";

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

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
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

    startTransition(async () => {
      try {
        const res = await repoAddPost({
          guyName: guyName || undefined,
          guyPhone: guyPhone || undefined,
          guySocials: guySocials || undefined,
          guyLocation: guyLocation || undefined,
          guyAge: guyAge ? Number(guyAge) : undefined,
          storyText: storyText,
          tags: tags as any,
          imageUrl: null,
          anonymous,
          nickname: anonymous ? undefined : nickname || undefined,
        });
        if ((res as any)?.success) {
          setSuccess("Posted! 🎉 Redirecting...");
          setTimeout(() => router.push("/app"), 800);
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

