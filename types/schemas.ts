import { z } from 'zod'

export const RawPlayerSchema = z.record(z.string(), z.any())

export const UpdatePlayerSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  games: z.number().int().min(0).optional(),
  atBats: z.number().int().min(0).optional(),
  runs: z.number().int().min(0).optional(),
  hits: z.number().int().min(0).optional(),
  doubles: z.number().int().min(0).optional(),
  triples: z.number().int().min(0).optional(),
  homeRuns: z.number().int().min(0).optional(),
  rbi: z.number().int().min(0).optional(),
  walks: z.number().int().min(0).optional(),
  strikeouts: z.number().int().min(0).optional(),
  stolenBases: z.number().int().min(0).optional(),
  caughtStealing: z.number().int().min(0).optional(),
  avg: z.number().min(0).max(1).optional(),
  obp: z.number().min(0).optional(),
  slg: z.number().min(0).optional(),
  ops: z.number().min(0).optional()
})
