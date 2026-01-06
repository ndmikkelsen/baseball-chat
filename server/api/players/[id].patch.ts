import { z } from 'zod'
import { updatePlayer } from '../../services/players'

const UpdatePlayerSchema = z.object({
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

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Missing player id' })
    }

    const body = await readBody(event)
    const validated = UpdatePlayerSchema.parse(body)

    const updated = await updatePlayer(id, validated)
    return updated
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { message: error.issues[0]?.message || 'Invalid data' }
      })
    }
    throw error
  }
})
