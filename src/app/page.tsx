import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button asChild>
        <Link href="/about">About</Link>
      </Button>
      <h1>Home</h1>
    </div>
  );
}