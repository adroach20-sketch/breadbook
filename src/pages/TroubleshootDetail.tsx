import { useParams, Link, useSearchParams } from 'react-router-dom'
import { symptoms, categoryLabels } from '../data/troubleshooter'

const confidenceLabels: Record<string, { label: string; className: string }> = {
  most_likely: { label: 'Most likely cause', className: 'bg-crust/10 text-crust' },
  possibly: { label: 'Possible cause', className: 'bg-wheat/20 text-char' },
  could_also_be: { label: 'Could also be', className: 'bg-dough text-ash' },
}

export function TroubleshootDetail() {
  const { symptomId } = useParams<{ symptomId: string }>()
  const [searchParams] = useSearchParams()
  const symptom = symptoms.find((s) => s.id === symptomId)

  // Preserve context for back navigation
  const recipeId = searchParams.get('recipe')
  const sessionId = searchParams.get('session')
  const backParams = [
    recipeId ? `recipe=${recipeId}` : '',
    sessionId ? `session=${sessionId}` : '',
  ].filter(Boolean).join('&')

  if (!symptom) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <span className="text-4xl block mb-3">🤔</span>
        <p className="text-ash mb-4">Symptom not found.</p>
        <Link to="/troubleshoot" className="text-crust font-medium hover:underline">
          Back to troubleshooter
        </Link>
      </div>
    )
  }

  const conf = confidenceLabels[symptom.confidence]
  const related = symptom.relatedSymptoms
    ? symptom.relatedSymptoms.map((id) => symptoms.find((s) => s.id === id)).filter(Boolean)
    : []

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Back */}
      <Link
        to={`/troubleshoot${backParams ? `?${backParams}` : ''}`}
        className="text-sm text-crust hover:underline mb-4 inline-block"
      >
        ← All symptoms
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{symptom.emoji}</span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-char">{symptom.title}</h1>
            <span className="text-xs text-ash">
              {categoryLabels[symptom.category].emoji} {categoryLabels[symptom.category].label}
            </span>
          </div>
        </div>
        <p className="text-ash leading-relaxed">{symptom.description}</p>
      </div>

      {/* Cause explanation */}
      <div className="bg-steam border border-dough rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-semibold text-char">Why this happens</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conf.className}`}>
            {conf.label}
          </span>
        </div>
        <p className="text-ash text-sm leading-relaxed">{symptom.cause}</p>
      </div>

      {/* Fixes */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-semibold text-char mb-3">
          How to fix it
        </h2>
        <div className="space-y-4">
          {symptom.fixes.map((fix, i) => (
            <div key={i} className="bg-steam border border-dough rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-crust text-steam w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-char">{fix.title}</p>
                  <p className="text-ash text-sm mt-1 leading-relaxed">{fix.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related symptoms */}
      {related.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-ash mb-2">Related issues</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r!.id}
                to={`/troubleshoot/${r!.id}${backParams ? `?${backParams}` : ''}`}
                className="inline-flex items-center gap-1.5 bg-dough rounded-full px-3 py-1.5 text-sm text-char hover:bg-dough/80 transition-colors"
              >
                <span>{r!.emoji}</span>
                {r!.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      {recipeId && (
        <Link
          to={`/bake/${recipeId}`}
          className="block w-full text-center bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors mb-3"
        >
          Bake This Again
        </Link>
      )}
      <Link
        to={`/troubleshoot${backParams ? `?${backParams}` : ''}`}
        className="block text-center text-ash text-sm hover:text-char transition-colors"
      >
        Check another symptom
      </Link>
    </div>
  )
}
