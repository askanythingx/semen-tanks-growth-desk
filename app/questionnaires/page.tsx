import PageShell from '@/components/PageShell'
import Link from 'next/link'

const questionnaires = [
  {
    slug: 'buyer-priority',
    title: 'Buyer Priority Quiz',
    description: 'Janey & Mark assign % priority to each of the 8 buyer angles so we can focus Google Ads budget correctly.',
    submittedBy: 'Janey & Mark',
    status: 'Active',
    questions: 8,
    color: 'border-purple-200',
    dot: 'bg-purple-500',
  },
]

export default function QuestionnairesPage() {
  return (
    <PageShell>
      <div className="px-4 pt-6 max-w-2xl mx-auto">

        <div className="mb-6">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">GrowthDesk</div>
          <h1 className="text-2xl font-semibold text-gray-900">Questionnaires</h1>
          <p className="text-sm text-gray-500 mt-1">Tap to open a survey — mobile friendly</p>
        </div>

        <div className="flex flex-col gap-3">
          {questionnaires.map(q => (
            <Link key={q.slug} href={`/questionnaires/${q.slug}`}
              className={`bg-white rounded-2xl border ${q.color} p-5 block active:scale-98 transition-all`}>
              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${q.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-base">{q.title}</div>
                  <div className="text-sm text-gray-400 mt-1 leading-relaxed">{q.description}</div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-gray-400">{q.questions} questions</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">For: {q.submittedBy}</span>
                    <span className="ml-auto text-xs font-medium text-green-600">{q.status}</span>
                  </div>
                </div>
                <span className="text-gray-300 text-xl ml-2">›</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
