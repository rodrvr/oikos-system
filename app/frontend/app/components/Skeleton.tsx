export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 animate-fade-in">
      <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
      <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-600 rounded mb-2" />
      <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-600 rounded" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl p-6 bg-white dark:bg-zinc-800 shadow-md animate-fade-in">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
          <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-600 rounded" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 opacity-50 animate-fade-in" role="status">
      <p>{message}</p>
    </div>
  );
}
