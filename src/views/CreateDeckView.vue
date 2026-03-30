<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

import CardGrid from '../components/layout/CardGrid.vue'

const api = useApi()
const router = useRouter()

const allCards = ref<Card[]>([])
const deckName = ref('')
const selectedIds = ref<number[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getCards()
    allCards.value = data as Card[]
  } catch {
    alert('Erreur lors du chargement des cartes')
  } finally {
    isLoading.value = false
  }
})

const toggleCard = (id: number) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else if (selectedIds.value.length < 10) {
    selectedIds.value.push(id)
  }
}

const isInvalid = computed(() => {
  return deckName.value.trim() === '' || selectedIds.value.length !== 10
})

const handleSubmit = async () => {
  if (isInvalid.value) return
  try {
    await api.createDeck({
      name: deckName.value,
      cards: selectedIds.value,
    })
    router.push('/')
  } catch {
    alert('Erreur lors de la création du deck')
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Créer un nouveau Deck</h1>
    <div
      class="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-0 z-10 border-b"
    >
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700"
            >Nom du deck</label
          >
          <input
            v-model="deckName"
            type="text"
            class="w-full border rounded p-2 mt-1"
            placeholder="Mon super deck..."
          />
        </div>
        <div
          class="text-lg font-semibold"
          :class="
            selectedIds.length === 10 ? 'text-green-600' : 'text-orange-500'
          "
        >
          Cartes : {{ selectedIds.length }} / 10
        </div>
        <button
          class="bg-blue-600 text-white px-6 py-2 rounded font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="isInvalid"
          @click="handleSubmit"
        >
          Créer le deck
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      Chargement des Pokémon...
    </div>

    <CardGrid
      v-if="!isLoading"
      :cards="allCards"
      :selected-ids="selectedIds"
      :max-selection="10"
      @toggle-card="toggleCard"
    />
  </div>
</template>
