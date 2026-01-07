import { mapRawToPlayer } from '../utils/player'
import { RawPlayerSchema } from '../../types/schemas'
import type { Player } from '../../types/player'
import prisma from '../utils/prisma'

let cachedUpstreamPlayers: Player[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000

async function fetchUpstreamPlayers(): Promise<Player[]> {
  const now = Date.now()
  if (cachedUpstreamPlayers && now - cacheTimestamp < CACHE_TTL) {
    return cachedUpstreamPlayers
  }

  const raw = await $fetch<any[]>('https://api.hirefraction.com/api/test/baseball')
  if (!Array.isArray(raw)) {
    throw createError({ statusCode: 502, statusMessage: 'Bad upstream payload' })
  }

  cachedUpstreamPlayers = raw.map((p, i) => mapRawToPlayer(RawPlayerSchema.parse(p), i))
  cacheTimestamp = now
  return cachedUpstreamPlayers
}

export async function getAllPlayers(): Promise<Player[]> {
  const upstream = await fetchUpstreamPlayers()
  const overrides = await prisma.player.findMany()

  const overrideMap = new Map(overrides.map(p => [p.id, p]))

  return upstream.map(p => {
    const override = overrideMap.get(p.id)
    return override ? { ...p, ...override } : p
  })
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const players = await getAllPlayers()
  return players.find(p => p.id === id) ?? null
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
  const existing = await getPlayerById(id)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Player not found' })
  }

  const updated = await prisma.player.upsert({
    where: { id },
    create: { ...existing, ...data },
    update: data
  })

  return updated
}
