import type { RecipeStep } from '../data/types'

function formatTime(minutes: number): string {
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
  }
  return `${minutes}m`
}

export function StepList({ steps }: { steps: RecipeStep[] }) {
  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-char mb-3">Steps</h2>
      <ol className="space-y-4">
        {steps.map((step, idx) => (
          <li key={step.id} className="flex gap-3">
            <div className="flex-shrink-0 w-7 h-7 bg-crust text-steam rounded-full flex items-center justify-center text-sm font-medium">
              {idx + 1}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-char">{step.title}</h3>
                {step.is_optional && (
                  <span className="text-[10px] bg-wheat/30 text-ash px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                )}
              </div>
              <p className="text-sm text-ash leading-relaxed">{step.instruction}</p>
              {step.timer_minutes && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-crust bg-dough/50 px-2 py-1 rounded">
                  ⏱ {step.timer_label || formatTime(step.timer_minutes)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
