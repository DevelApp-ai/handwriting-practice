import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react'
import { RADICALS, groupByRadical, getDecomposition } from '@/lib/radicals'

interface RadicalExplorerProps {
  onBack: () => void
}

export function RadicalExplorer({ onBack }: RadicalExplorerProps) {
  const [query, setQuery] = useState('')
  const groups = groupByRadical()

  const filtered = query
    ? RADICALS.filter(
        (r) =>
          r.name.includes(query) ||
          r.char.includes(query) ||
          r.meaning.includes(query),
      )
    : RADICALS

  const lookup = query.length === 1 ? getDecomposition(query) : undefined

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card shadow-sm">
        <Button variant="ghost" size="lg" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="font-bold text-xl md:text-2xl" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          Radical Explorer
        </div>
        <div className="w-16" />
      </div>

      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <MagnifyingGlass className="w-5 h-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search radicals by name/meaning, or type a character to decompose"
            className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {lookup && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-lg border border-border bg-card">
            <div className="text-lg font-semibold mb-2">
              Decomposition of <span className="text-3xl">{lookup.char}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {lookup.radicalIds.map((rid, i) => {
                const r = RADICALS.find((x) => x.id === rid)
                return (
                  <div key={i} className="flex flex-col items-center p-2 rounded-md border border-border">
                    <span className="text-3xl">{r?.char ?? '?'}</span>
                    <span className="text-xs text-muted-foreground">{r?.name ?? rid}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {query && filtered.length > 0 && !lookup && (
          <div className="max-w-4xl mx-auto mb-6">
            <h3 className="text-lg font-semibold mb-3">Matching radicals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((r) => (
                <div key={r.id} className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{r.char}</span>
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.meaning}</div>
                      <div className="text-xs text-muted-foreground">{r.strokes} strokes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-3">Characters grouped by radical</h3>
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.radical.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{g.radical.char}</span>
                  <div>
                    <div className="font-semibold">{g.radical.name}</div>
                    <div className="text-xs text-muted-foreground">{g.radical.meaning}</div>
                  </div>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {g.chars.length} character{g.chars.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.chars.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-md border border-border bg-background text-2xl"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
