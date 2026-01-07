<script setup lang="ts">
import type { SortDirection } from "~~/types/player"

const props = defineProps<{
  active: boolean
  direction: SortDirection
}>()

const icon = computed(() => {
  if (!props.active) {
    return "i-heroicons-arrows-up-down"
  }
  return props.direction === "desc" 
    ? "i-heroicons-arrow-down" 
    : "i-heroicons-arrow-up"
})
</script>

<template>
  <UIcon 
    :name="icon" 
    :class="[
      'w-4 h-4 transition-opacity',
      active ? 'opacity-100' : 'opacity-30'
    ]" 
  />
</template>
