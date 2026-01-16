export type Player = {
  id: string
  name: string
  position: string
  games: number
  atBats: number
  runs: number
  hits: number
  doubles: number
  triples: number
  homeRuns: number
  rbi: number
  walks: number
  strikeouts: number
  stolenBases: number
  caughtStealing: number
  avg: number
  obp: number
  slg: number
  ops: number
  description?: string | null
}

export type SortKey = "name" | "position" | "games" | "hits" | "hitsPerGame" | "homeRuns" | "avg" | "ops"
export type SortDirection = "asc" | "desc"
