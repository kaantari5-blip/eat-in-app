export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FCF8F3] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-32 animate-pulse rounded-[2rem] bg-[#F1E4D8]" />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-24 animate-pulse rounded-3xl bg-[#F1E4D8]" />
          <div className="h-24 animate-pulse rounded-3xl bg-[#F1E4D8]" />
          <div className="h-24 animate-pulse rounded-3xl bg-[#F1E4D8]" />
        </div>

        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-[2rem] bg-[#F1E4D8]" />
          <div className="h-32 animate-pulse rounded-[2rem] bg-[#F1E4D8]" />
          <div className="h-32 animate-pulse rounded-[2rem] bg-[#F1E4D8]" />
        </div>
      </div>
    </main>
  );
}