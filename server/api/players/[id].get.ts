import { getPlayerById } from '../../services/players'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing player id' })
  }

  const player = await getPlayerById(id)
  if (!player) {
    throw createError({ statusCode: 404, statusMessage: 'Player not found' })
  }

  return player
})
