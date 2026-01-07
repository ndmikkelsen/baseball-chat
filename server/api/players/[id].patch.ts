import { z } from 'zod'
import { updatePlayer } from '../../services/players'
import { UpdatePlayerSchema } from '../../../types/schemas'

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
