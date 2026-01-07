import OpenAI from 'openai'
import { getPlayerById, updatePlayer } from '../../../services/players'
import type { DescriptionResponse } from '../../../../types/api'

export default defineEventHandler(async (event): Promise<DescriptionResponse> => {
  const config = useRuntimeConfig(event)
  const apiKey = config.openaiApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'OpenAI API key not configured' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing player id' })
  }

  const player = await getPlayerById(id)
  if (!player) {
    throw createError({ statusCode: 404, statusMessage: 'Player not found' })
  }

  if (player.description) {
    return { description: player.description, cached: true }
  }

  const openai = new OpenAI({ apiKey })

  const prompt = `Generate a brief scouting report (2-3 sentences) for this baseball player based on their career statistics:

Player: ${player.name}
Position: ${player.position}
Games: ${player.games}
Hits: ${player.hits}
Home Runs: ${player.homeRuns}
RBI: ${player.rbi}
Batting Average: ${player.avg.toFixed(3)}
OPS: ${player.ops.toFixed(3)}

Focus on their strengths and what made them notable.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 150
  })

  const description = completion.choices[0]?.message?.content?.trim() ?? 'No description available.'

  await updatePlayer(id, { description })

  return { description, cached: false }
})
