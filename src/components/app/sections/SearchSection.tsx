"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { repoSearchGuys } from "@/lib/actions/domain";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

interface GuyItem {
  id: string;
  name: string | null;
  phone: string | null;
  socials: string | null;
  location: string | null;
  age: number | null;
}

export function SearchSection() {
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GuyItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async () => {
    setError(null);
    if (!term.trim()) return;
    setLoading(true);
    try {
      const res = await repoSearchGuys(term.trim(), 10);
      setResults((res as any).data as GuyItem[]);
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setTerm("");
    setResults([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Search for Someone 🔍</h2>
        <p className="text-sm text-muted-foreground">Spill or find the tea ☕</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <label className="text-sm font-medium">Who are we investigating? 👀</label>
          <Input
            placeholder="Name, nickname, phone, social handle..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={onSearch} disabled={loading || !term.trim()} className="flex-1">
              {loading ? "Searching..." : "Find the Tea ☕"}
            </Button>
            {term.length > 0 && (
              <Button type="button" variant="secondary" onClick={onClear}>
                Clear
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold">Found the Tea! ☕ ({results.length})</h3>
          {results.map((guy) => (
            <Card key={guy.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {guy.name || "Unknown Name"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <div className="flex flex-wrap gap-3">
                  {guy.age != null && <span>{guy.age} years old</span>}
                  {guy.location && <span>📍 {guy.location}</span>}
                  {guy.phone && <span>📱 ***{String(guy.phone).slice(-4)}</span>}
                  {guy.socials && <span>📱 {guy.socials}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-primary">
        <CardContent className="pt-6 text-center space-y-2">
          <div className="text-2xl">🛡️</div>
          <p className="text-sm">
            <span className="font-semibold">Privacy Notice:</span> We don't store your searches bestie! All info is encrypted and only verified users can search 💕
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

