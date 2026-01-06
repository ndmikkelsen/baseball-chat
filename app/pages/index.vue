<script setup lang="ts">
import type { Player } from "~/server/utils/player";

type SortKey = "hits" | "homeRuns";
type SortDirection = "asc" | "desc";

const sortKey = ref<SortKey>("hits");
const sortDirection = ref<SortDirection>("desc");
const {
  data: players,
  pending,
  error,
} = await useFetch<Player[]>("/api/players");

const sorted = computed(() => {
  const list = players.value ?? [];
  return [...list].sort((a, b) => {
    const aVal = a[sortKey.value] ?? 0;
    const bVal = b[sortKey.value] ?? 0;
    return sortDirection.value === "desc" ? bVal - aVal : aVal - bVal;
  });
});

const sortOptions = computed(() => [
  {
    label: `Hits (${sortDirection.value === "desc" ? "High to Low" : "Low to High"})`,
    value: "hits",
  },
  {
    label: `Home Runs (${sortDirection.value === "desc" ? "High to Low" : "Low to High"})`,
    value: "homeRuns",
  },
]);

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === "desc" ? "asc" : "desc";
}
</script>

<template>
  <UContainer class="py-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Baseball Players</h1>
      <div class="flex gap-2">
        <USelectMenu
          v-model="sortKey"
          :options="sortOptions"
          value-attribute="value"
        />
        <UButton
          :icon="
            sortDirection === 'desc'
              ? 'i-heroicons-arrow-down'
              : 'i-heroicons-arrow-up'
          "
          variant="outline"
          @click="toggleSortDirection"
        />
      </div>
    </div>

    <UAlert
      v-if="error"
      color="error"
      title="Failed to load players"
      :description="String(error)"
    />

    <UCard v-else-if="pending">
      <div class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>
    </UCard>

    <UCard v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Player
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Pos
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                G
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                H
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                HR
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                AVG
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                OPS
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800"
          >
            <tr
              v-for="player in sorted"
              :key="player.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              @click="navigateTo(`/players/${player.id}`)"
            >
              <td
                class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ player.name }}
              </td>
              <td
                class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ player.position }}
              </td>
              <td
                class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ player.games }}
              </td>
              <td
                class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ player.hits }}
              </td>
              <td
                class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ player.homeRuns }}
              </td>
              <td
                class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ player.avg.toFixed(3) }}
              </td>
              <td
                class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ player.ops.toFixed(3) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>
