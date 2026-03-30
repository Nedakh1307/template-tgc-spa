<script setup lang="ts">
import { NButton, NCard, NEmpty, NSelect } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

const api = useApi()
const router = useRouter()

const decks = ref<Deck[]>([])
const isLoading = ref(true)
const selectedDeck = ref<string | number | null>(null)

const loadData = async (): Promise<void> => {
  isLoading.value = true
  try {
    const data = await api.getMyDecks()
    decks.value = data
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err instanceof Error ? err.message : String(err))
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async (id: string | number): Promise<void> => {
  if (!window.confirm('Supprimer ce deck ?')) return
  try {
    await api.deleteDeck(id)
    await loadData()
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Erreur de suppression')
  }
}

onMounted(loadData)
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-xl font-bold mb-6">Jouer</h1>

    <div class="grid grid-cols-2 gap-6 mb-8">
      <NCard title="Créer une partie">
        <div class="flex flex-col gap-4">
          <NSelect
            v-model:value="selectedDeck"
            placeholder="Sélectionner un deck"
            :options="decks.map((d) => ({ label: d.name, value: d.id }))"
          />
          <NButton type="primary" :disabled="!selectedDeck" block>
            Créer la partie
          </NButton>
        </div>
      </NCard>

      <NCard title="Parties disponibles">
        <div class="flex flex-col items-center justify-center py-4">
          <NEmpty description="Aucune partie disponible pour l'instant." />
        </div>
      </NCard>
    </div>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold">Mes decks</h2>
      <NButton
        type="primary"
        color="#18a058"
        @click="router.push('/decks/create')"
      >
        + Nouveau deck
      </NButton>
    </div>

    <div class="bg-white rounded-lg shadow border p-4">
      <div v-if="decks.length === 0" class="text-center py-4 text-gray-500">
        Aucun deck créé pour le moment.
      </div>

      <div
        v-for="deck in decks"
        :key="deck.id"
        class="flex justify-between items-center p-4 border-b last:border-b-0"
      >
        <span class="font-medium text-gray-700">{{ deck.name }}</span>
        <div class="flex gap-2">
          <NButton size="small" @click="router.push(`/decks/${deck.id}`)"
            >Modifier</NButton
          >
          <NButton size="small" type="error" @click="handleDelete(deck.id)"
            >Supprimer</NButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
