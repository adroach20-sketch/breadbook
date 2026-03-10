export function RecipeCardSkeleton() {
  return (
    <div className="bg-steam rounded-xl shadow-sm p-4 border border-dough animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-dough rounded" />
        <div className="w-20 h-5 bg-dough rounded-full" />
      </div>
      <div className="h-5 bg-dough rounded w-3/4 mb-2" />
      <div className="h-4 bg-dough rounded w-full mb-1" />
      <div className="h-4 bg-dough rounded w-2/3 mb-3" />
      <div className="flex gap-3">
        <div className="h-3 bg-dough rounded w-16" />
        <div className="h-3 bg-dough rounded w-12" />
      </div>
    </div>
  )
}
