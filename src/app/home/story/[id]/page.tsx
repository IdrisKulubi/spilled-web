export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Story Details</h1>
      <p className="text-sm text-muted-foreground">Coming soon – full story view and comments for {id}</p>
    </div>
  );
}

