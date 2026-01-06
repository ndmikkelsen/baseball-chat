import { getAllPlayers } from '../services/players'

export default defineEventHandler(async () => {
  return await getAllPlayers()
})
