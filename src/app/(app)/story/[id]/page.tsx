export default function StoryDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Story Details</h1>
      <p className="text-sm text-muted-foreground">Coming soon – full story view and comments for {params.id}</p>
    </div>
  );
}

