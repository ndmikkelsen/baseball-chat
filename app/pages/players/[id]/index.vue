<script setup lang="ts">
import type { Player } from "~~/types/player";

const route = useRoute()
const id = route.params.id as string

const { data: player, pending, error, refresh } = await useFetch<Player>(`/api/players/${id}`)

const generatingDescription = ref(false)
const descriptionError = ref<string | null>(null)

async function generateDescription() {
  generatingDescription.value = true
  descriptionError.value = null

  try {
    await $fetch(`/api/players/${id}/description`, { method: 'POST' })
    await refresh()
  } catch (err) {
    const error = err as { data?: { message?: string }, message?: string }
    descriptionError.value = error.data?.message || error.message || 'Failed to generate description'
  } finally {
    generatingDescription.value = false
  }
}

const stats = computed(() => {
  if (!player.value) return []
  const p = player.value
  return [
    { label: 'Position', value: p.position },
    { label: 'Games', value: p.games },
    { label: 'At Bats', value: p.atBats },
    { label: 'Runs', value: p.runs },
    { label: 'Hits', value: p.hits },
    { label: 'Doubles', value: p.doubles },
    { label: 'Triples', value: p.triples },
    { label: 'Home Runs', value: p.homeRuns },
    { label: 'RBI', value: p.rbi },
    { label: 'Walks', value: p.walks },
    { label: 'Strikeouts', value: p.strikeouts },
    { label: 'Stolen Bases', value: p.stolenBases },
    { label: 'Caught Stealing', value: p.caughtStealing },
    { label: 'AVG', value: p.avg.toFixed(3) },
    { label: 'OBP', value: p.obp.toFixed(3) },
    { label: 'SLG', value: p.slg.toFixed(3) },
    { label: 'OPS', value: p.ops.toFixed(3) }
  ]
})
</script>

<template>
  <UContainer class="py-6">
    <UButton
      icon="i-heroicons-arrow-left"
      variant="ghost"
      to="/"
      class="mb-4"
    >
      Back to Players
    </UButton>

    <UAlert v-if="error" color="error" title="Failed to load player" :description="String(error)" />

    <div v-else-if="player" class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">{{ player.name }}</h1>
        <UButton
          icon="i-heroicons-pencil"
          :to="`/players/${id}/edit`"
        >
          Edit
        </UButton>
      </div>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Career Statistics</h2>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="space-y-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-lg font-semibold">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Scouting Report</h2>
            <UButton
              v-if="!player.description"
              :loading="generatingDescription"
              @click="generateDescription"
            >
              Generate Description
            </UButton>
          </div>
        </template>

        <UAlert
          v-if="descriptionError"
          color="error"
          title="Error"
          :description="descriptionError"
          class="mb-4"
        />

        <p v-if="player.description" class="text-gray-700 dark:text-gray-300">
          {{ player.description }}
        </p>
        <p v-else class="text-gray-500 dark:text-gray-400 italic">
          No description available. Click "Generate Description" to create one using AI.
        </p>
      </UCard>
    </div>

    <div v-else-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
    </div>
  </UContainer>
</template>
