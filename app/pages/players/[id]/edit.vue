<script setup lang="ts">
import type { Player } from "~~/types/player";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const { data: player, pending, error } = useFetch<Player>(`/api/players/${id}`);

const form = ref<Omit<Player, "id" | "description">>({
  name: "",
  position: "",
  games: 0,
  atBats: 0,
  runs: 0,
  hits: 0,
  doubles: 0,
  triples: 0,
  homeRuns: 0,
  rbi: 0,
  walks: 0,
  strikeouts: 0,
  stolenBases: 0,
  caughtStealing: 0,
  avg: 0,
  obp: 0,
  slg: 0,
  ops: 0,
});

watch(
  player,
  (newPlayer) => {
    if (newPlayer) {
      const { id, description, ...editableFields } = newPlayer;
      form.value = editableFields;
    }
  },
  { immediate: true },
);

const saving = ref(false);
const saveError = ref<string | null>(null);

async function save() {
  saving.value = true;
  saveError.value = null;

  try {
    await $fetch(`/api/players/${id}`, {
      method: "PATCH",
      body: form.value,
    });
    router.push(`/players/${id}`);
  } catch (err) {
    const error = err as { data?: { message?: string }; message?: string };
    saveError.value =
      error.data?.message || error.message || "Failed to save changes";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <UContainer class="py-6">
    <UButton
      icon="i-heroicons-arrow-left"
      variant="ghost"
      :to="`/players/${id}`"
      class="mb-4"
    >
      Back to Player
    </UButton>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      title="Failed to load player"
      :description="
        error.message ||
        error.statusMessage ||
        'An error occurred while loading the player'
      "
    />

    <div v-else-if="player" class="space-y-6">
      <h1 class="text-3xl font-bold">Edit {{ player.name }}</h1>

      <UAlert
        v-if="saveError"
        color="error"
        title="Error"
        :description="saveError"
        class="mb-4"
      />

      <UCard>
        <form @submit.prevent="save" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Name">
              <UInput v-model="form.name" required />
            </UFormGroup>

            <UFormGroup label="Position">
              <UInput v-model="form.position" required />
            </UFormGroup>

            <UFormGroup label="Games">
              <UInput
                v-model.number="form.games"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="At Bats">
              <UInput
                v-model.number="form.atBats"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Runs">
              <UInput
                v-model.number="form.runs"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Hits">
              <UInput
                v-model.number="form.hits"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Doubles">
              <UInput
                v-model.number="form.doubles"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Triples">
              <UInput
                v-model.number="form.triples"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Home Runs">
              <UInput
                v-model.number="form.homeRuns"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="RBI">
              <UInput
                v-model.number="form.rbi"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Walks">
              <UInput
                v-model.number="form.walks"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Strikeouts">
              <UInput
                v-model.number="form.strikeouts"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Stolen Bases">
              <UInput
                v-model.number="form.stolenBases"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="Caught Stealing">
              <UInput
                v-model.number="form.caughtStealing"
                type="number"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="AVG">
              <UInput
                v-model.number="form.avg"
                type="number"
                step="0.001"
                min="0"
                max="1"
                required
              />
            </UFormGroup>

            <UFormGroup label="OBP">
              <UInput
                v-model.number="form.obp"
                type="number"
                step="0.001"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="SLG">
              <UInput
                v-model.number="form.slg"
                type="number"
                step="0.001"
                min="0"
                required
              />
            </UFormGroup>

            <UFormGroup label="OPS">
              <UInput
                v-model.number="form.ops"
                type="number"
                step="0.001"
                min="0"
                required
              />
            </UFormGroup>
          </div>

          <div class="flex gap-2">
            <UButton type="submit" :loading="saving"> Save Changes </UButton>
            <UButton variant="ghost" :to="`/players/${id}`"> Cancel </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </UContainer>
</template>
