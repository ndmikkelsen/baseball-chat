<script setup lang="ts">
import type { Player, SortKey, SortDirection } from "~~/types/player";

type ColumnType = "string" | "number";

const columns: Array<{
  key: SortKey;
  label: string;
  shortLabel: string;
  type: ColumnType;
}> = [
  { key: "name", label: "Player", shortLabel: "Player", type: "string" },
  { key: "position", label: "Position", shortLabel: "Pos", type: "string" },
  { key: "games", label: "Games", shortLabel: "G", type: "number" },
  { key: "hits", label: "Hits", shortLabel: "H", type: "number" },
  { key: "homeRuns", label: "Home Runs", shortLabel: "HR", type: "number" },
  { key: "avg", label: "AVG", shortLabel: "AVG", type: "number" },
  { key: "ops", label: "OPS", shortLabel: "OPS", type: "number" },
];

const sortKey = ref<SortKey>("hits");
const sortDirection = ref<SortDirection>("desc");
const {
  data: players,
  pending,
  error,
} = await useFetch<Player[]>("/api/players");

function compareValues(aVal: unknown, bVal: unknown, type: ColumnType): number {
  if (type === "string") {
    const aStr = String(aVal ?? "").toLowerCase();
    const bStr = String(bVal ?? "").toLowerCase();
    return aStr.localeCompare(bStr);
  }
  const aNum = typeof aVal === "number" ? aVal : 0;
  const bNum = typeof bVal === "number" ? bVal : 0;
  return aNum - bNum;
}

const sorted = computed(() => {
  const list = players.value ?? [];
  const col = columns.find(c => c.key === sortKey.value);
  const type = col?.type ?? "number";

  const dir = sortDirection.value === "asc" ? 1 : -1;

  return [...list].sort((a, b) => {
    const cmp = compareValues(a[sortKey.value], b[sortKey.value], type);
    return dir * cmp;
  });
});

const sortOptions = computed(() =>
  columns.map(c => ({
    label: `${c.label} (${sortDirection.value === "desc" ? "High to Low" : "Low to High"})`,
    value: c.key,
  }))
);

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === "desc" ? "asc" : "desc";
}

function handleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === "desc" ? "asc" : "desc";
  } else {
    sortKey.value = key;
    const col = columns.find(c => c.key === key);
    sortDirection.value = col?.type === "string" ? "asc" : "desc";
  }
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
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none"
                @click="handleSort(col.key)"
              >
                <div class="flex items-center gap-1">
                  <span>{{ col.shortLabel }}</span>
                  <SortIndicator 
                    :active="sortKey === col.key" 
                    :direction="sortDirection" 
                  />
                </div>
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
                {{ player.avg?.toFixed(3) ?? 'N/A' }}
              </td>
              <td
                class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ player.ops?.toFixed(3) ?? 'N/A' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>
