// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">Unauthorized</h1>
      <p className="text-muted-foreground mt-2">
        You do not have permission to view this page.
      </p>
    </div>
  );
}
