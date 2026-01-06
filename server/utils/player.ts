import type { Player } from '../../types/player'
import { RawPlayerSchema } from '../../types/schemas'

const num = (v: unknown) => (typeof v === 'number' ? v : Number(v ?? 0))

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function mapRawToPlayer(raw: Record<string, any>, index: number): Player {
  const name = String(raw['Player name'] ?? raw['player name'] ?? raw['name'] ?? '')
  const id = `${slugify(name)}-${index}`

  return {
    id,
    name,
    position: String(raw['position'] ?? raw['Position'] ?? ''),
    games: num(raw['Games']),
    atBats: num(raw['At-bat'] ?? raw['At-bats']),
    runs: num(raw['Runs']),
    hits: num(raw['Hits']),
    doubles: num(raw['Double (2B)'] ?? raw['2B']),
    triples: num(raw['third baseman'] ?? raw['3B']),
    homeRuns: num(raw['home run'] ?? raw['Home run'] ?? raw['HR']),
    rbi: num(raw['run batted in'] ?? raw['RBI']),
    walks: num(raw['a walk'] ?? raw['BB']),
    strikeouts: num(raw['Strikeouts'] ?? raw['SO']),
    stolenBases: num(raw['stolen base'] ?? raw['SB']),
    caughtStealing: num(raw['Caught stealing'] ?? raw['CS']),
    avg: num(raw['AVG']),
    obp: num(raw['On-base Percentage'] ?? raw['OBP']),
    slg: num(raw['Slugging Percentage'] ?? raw['SLG']),
    ops: num(raw['On-base Plus Slugging'] ?? raw['OPS']),
    description: null
  }
}
